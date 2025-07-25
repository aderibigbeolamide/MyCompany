import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertEnrollmentSchema, insertBlogPostSchema, insertDynamicFormSchema, insertFormSubmissionSchema, insertUserSchema } from "@shared/schema";
import { insertContactSchema as mongoInsertContactSchema, insertEnrollmentSchema as mongoInsertEnrollmentSchema, insertBlogPostSchema as mongoInsertBlogPostSchema, insertDynamicFormSchema as mongoInsertDynamicFormSchema, insertFormSubmissionSchema as mongoInsertFormSubmissionSchema, insertUserSchema as mongoInsertUserSchema } from "@shared/mongodb-schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { AuthService, authConfig } from "./auth";
import { authenticateToken, requireAdmin, requireAuth, rateLimitLogin } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure Cloudinary with environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow images and videos
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed'));
      }
    }
  });

  // Configure session middleware with memory store
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
  
  app.use(session({
    store: sessionStore,
    secret: authConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'strict'
    }
  }));

  // Legacy middleware for session-based auth (kept for backward compatibility)
  const requireSessionAuth = (req: any, res: any, next: any) => {
    if ((req.session as any)?.user) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Authentication required" });
    }
  };

  const requireSessionAdmin = (req: any, res: any, next: any) => {
    if ((req.session as any)?.user?.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: "Admin access required" });
    }
  };

  // JWT Authentication routes
  app.post("/api/auth/login", rateLimitLogin, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
      }

      const user = await AuthService.authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const { accessToken, refreshToken } = AuthService.generateTokens(user);

      // Also set session for backward compatibility
      (req.session as any).user = user;

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  app.post("/api/auth/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required"
        });
      }

      const { accessToken } = await AuthService.refreshAccessToken(refreshToken);

      res.json({
        success: true,
        accessToken
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }
  });

  app.post("/api/auth/logout", authenticateToken, (req, res) => {
    // Clear session
    req.session?.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  });

  // User registration with password validation
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);

      // Validate password strength
      const passwordValidation = AuthService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet requirements",
          errors: passwordValidation.errors
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }

      // Hash password and create user
      const hashedPassword = await AuthService.hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Legacy login endpoint for backward compatibility
  app.post("/api/auth/login-legacy", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Trim whitespace from inputs
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(trimmedUsername);
      if (existingUser) {
        res.status(400).json({ success: false, message: "Username already exists" });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
      
      // Create user
      const user = await storage.createUser({ username: trimmedUsername, password: hashedPassword });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      // Parse and automatically trim whitespace from login credentials
      const { username, password } = insertUserSchema.parse({
        username: req.body.username?.trim(),
        password: req.body.password?.trim()
      });
      
      // Trim whitespace from inputs
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      // Find user
      const user = await storage.getUserByUsername(trimmedUsername);
      if (!user) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);
      if (!isValidPassword) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
        return;
      }

      // Store user in session
      (req.session as any).user = user;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Failed to logout" });
      } else {
        res.json({ success: true, message: "Logged out successfully" });
      }
    });
  });

  app.get("/api/auth/me", (req: any, res) => {
    if ((req.session as any)?.user) {
      const { password: _, ...userWithoutPassword } = (req.session as any).user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "Not authenticated" });
    }
  });
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", requireAuth, requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Enrollment form submission
  app.post("/api/enrollment", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.json({ success: true, enrollment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Get all enrollments (for admin purposes)
  app.get("/api/enrollments", requireAuth, requireAdmin, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Media upload route - supports multiple files with local storage fallback
  app.post("/api/upload", requireAdmin, upload.array('files', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }

      // Check if Cloudinary is properly configured
      const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                                  process.env.CLOUDINARY_API_KEY && 
                                  process.env.CLOUDINARY_API_SECRET;
      
      console.log('Cloudinary config check:', {
        hasConfig: hasCloudinaryConfig,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'not set',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'set' : 'not set',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set'
      });

      if (hasCloudinaryConfig) {
        // Upload all files to Cloudinary
        const uploadPromises = files.map(file => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto", // Automatically detect file type
                folder: "technurture_blog", // Organize uploads in a folder
              },
              (error, result) => {
                if (error) reject(error);
                else resolve({
                  url: result!.secure_url,
                  public_id: result!.public_id,
                  resource_type: result!.resource_type,
                  format: result!.format
                });
              }
            );
            uploadStream.end(file.buffer);
          });
        });

        const results = await Promise.all(uploadPromises);

        res.json({
          success: true,
          files: results
        });
      } else {
        // Local storage fallback - create data URLs for immediate use
        const results = files.map(file => {
          const base64Data = file.buffer.toString('base64');
          const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
          
          return {
            url: dataUrl,
            public_id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            format: file.mimetype.split('/')[1]
          };
        });

        res.json({
          success: true,
          files: results,
          message: "Files uploaded locally. For production, configure Cloudinary credentials."
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  });

  // Blog Posts Routes
  app.post("/api/blog", requireAuth, requireAdmin, async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(blogData);
      res.json({ success: true, blogPost });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const blogPosts = await storage.getBlogPosts(published);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      const blogPost = await storage.getBlogPost(id);
      if (!blogPost) {
        res.status(404).json({ success: false, message: "Blog post not found" });
        return;
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put("/api/blog/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      const updateData = insertBlogPostSchema.partial().parse(req.body);
      const blogPost = await storage.updateBlogPost(id, updateData);
      res.json({ success: true, blogPost });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.delete("/api/blog/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      await storage.deleteBlogPost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Dynamic Forms Routes
  app.post("/api/forms", requireAuth, requireAdmin, async (req, res) => {
    try {
      const formData = insertDynamicFormSchema.parse(req.body);
      const form = await storage.createDynamicForm(formData);
      res.json({ success: true, form });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.get("/api/forms", async (req, res) => {
    try {
      const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
      const forms = await storage.getDynamicForms(active);
      res.json(forms);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/forms/:id", async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      const form = await storage.getDynamicForm(id);
      if (!form) {
        res.status(404).json({ success: false, message: "Form not found" });
        return;
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put("/api/forms/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      const updateData = insertDynamicFormSchema.partial().parse(req.body);
      const form = await storage.updateDynamicForm(id, updateData);
      res.json({ success: true, form });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  app.delete("/api/forms/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      await storage.deleteDynamicForm(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Form Submissions Routes
  app.post("/api/forms/:id/submit", async (req, res) => {
    try {
      const formId = req.params.id; // Keep as string for MongoDB
      const submissionData = {
        formId,
        submissionData: JSON.stringify(req.body),
      };
      const submission = await storage.createFormSubmission(submissionData);
      res.json({ success: true, submission });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/submissions", requireAuth, requireAdmin, async (req, res) => {
    try {
      const formId = req.query.formId ? parseInt(req.query.formId as string) : undefined;
      const submissions = await storage.getFormSubmissions(formId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Media Upload Routes
  app.post("/api/upload/image", authenticateToken, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided"
        });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'technurture/images',
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
              { width: 1200, height: 800, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file!.buffer);
      });

      res.json({
        success: true,
        data: {
          url: (result as any).secure_url,
          publicId: (result as any).public_id,
          width: (result as any).width,
          height: (result as any).height,
          format: (result as any).format
        }
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image"
      });
    }
  });

  app.post("/api/upload/video", authenticateToken, upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No video file provided"
        });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'technurture/videos',
            transformation: [
              { quality: 'auto' },
              { width: 1280, height: 720, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file!.buffer);
      });

      res.json({
        success: true,
        data: {
          url: (result as any).secure_url,
          publicId: (result as any).public_id,
          width: (result as any).width,
          height: (result as any).height,
          duration: (result as any).duration,
          format: (result as any).format,
          thumbnail: cloudinary.url((result as any).public_id, {
            resource_type: 'video',
            format: 'jpg',
            start_offset: '0',
            width: 400,
            height: 300,
            crop: 'fill'
          })
        }
      });
    } catch (error) {
      console.error('Video upload error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to upload video"
      });
    }
  });

  // Delete media from Cloudinary
  app.delete("/api/upload/:publicId", authenticateToken, async (req, res) => {
    try {
      const { publicId } = req.params;
      const { resourceType } = req.query;
      
      await cloudinary.uploader.destroy(publicId.replace(/-/g, '/'), {
        resource_type: resourceType || 'image'
      });

      res.json({
        success: true,
        message: "Media deleted successfully"
      });
    } catch (error) {
      console.error('Media deletion error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to delete media"
      });
    }
  });

  // Get upload signature for direct client uploads
  app.post("/api/upload/signature", authenticateToken, (req, res) => {
    try {
      const { folder, resourceType } = req.body;
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder: folder || 'technurture',
          resource_type: resourceType || 'image'
        },
        process.env.CLOUDINARY_API_SECRET!
      );

      res.json({
        success: true,
        data: {
          signature,
          timestamp,
          apiKey: process.env.CLOUDINARY_API_KEY,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME
        }
      });
    } catch (error) {
      console.error('Signature generation error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to generate upload signature"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
