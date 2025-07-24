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

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure Cloudinary - using environment variables for security
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkslyztrf',
    api_key: process.env.CLOUDINARY_API_KEY || '598172739873685',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'c_mSuKLzQxlqDErCwLnNiIMhjGE'
  });

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
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
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if ((req.session as any)?.user) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Authentication required" });
    }
  };

  // Middleware to check if user is admin
  const requireAdmin = (req: any, res: any, next: any) => {
    if ((req.session as any)?.user?.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: "Admin access required" });
    }
  };

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
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
      const { username, password } = insertUserSchema.parse(req.body);
      
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
  app.get("/api/contacts", requireAdmin, async (req, res) => {
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
  app.get("/api/enrollments", requireAdmin, async (req, res) => {
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
  app.post("/api/blog", requireAdmin, async (req, res) => {
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

  app.put("/api/blog/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id; // Keep as string for MongoDB ObjectId
      await storage.deleteBlogPost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Dynamic Forms Routes
  app.post("/api/forms", requireAdmin, async (req, res) => {
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

  app.put("/api/forms/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/forms/:id", requireAdmin, async (req, res) => {
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

  app.get("/api/submissions", requireAdmin, async (req, res) => {
    try {
      const formId = req.query.formId ? parseInt(req.query.formId as string) : undefined;
      const submissions = await storage.getFormSubmissions(formId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
