import { 
  contacts, enrollments, users, blogPosts, dynamicForms, formSubmissions,
  type Contact, type Enrollment, type User, type BlogPost, type DynamicForm, type FormSubmission,
  type InsertContact, type InsertEnrollment, type InsertUser, type InsertBlogPost, type InsertDynamicForm, type InsertFormSubmission 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollments(): Promise<Enrollment[]>;

  // Blog Posts
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Dynamic Forms
  createDynamicForm(form: InsertDynamicForm): Promise<DynamicForm>;
  getDynamicForms(active?: boolean): Promise<DynamicForm[]>;
  getDynamicForm(id: number): Promise<DynamicForm | undefined>;
  updateDynamicForm(id: number, form: Partial<InsertDynamicForm>): Promise<DynamicForm>;
  deleteDynamicForm(id: number): Promise<void>;

  // Form Submissions
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getFormSubmissions(formId?: number): Promise<FormSubmission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private enrollments: Map<number, Enrollment>;
  private blogPosts: Map<number, BlogPost>;
  private dynamicForms: Map<number, DynamicForm>;
  private formSubmissions: Map<number, FormSubmission>;
  private currentUserId: number;
  private currentContactId: number;
  private currentEnrollmentId: number;
  private currentBlogPostId: number;
  private currentDynamicFormId: number;
  private currentFormSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.enrollments = new Map();
    this.blogPosts = new Map();
    this.dynamicForms = new Map();
    this.formSubmissions = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentEnrollmentId = 1;
    this.currentBlogPostId = 1;
    this.currentDynamicFormId = 1;
    this.currentFormSubmissionId = 1;
    
    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    // Import bcrypt dynamically to avoid circular dependency
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    const adminUser: User = {
      id: this.currentUserId++,
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };
    
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      phone: insertContact.phone || null,
      service: insertContact.service || null,
      newsletter: insertContact.newsletter || null,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = {
      ...insertEnrollment,
      phone: insertEnrollment.phone || null,
      experience: insertEnrollment.experience || null,
      motivation: insertEnrollment.motivation || null,
      id,
      createdAt: new Date(),
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async getEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  // Blog Posts
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const blogPost: BlogPost = {
      ...insertBlogPost,
      excerpt: insertBlogPost.excerpt || null,
      category: insertBlogPost.category || null,
      authorAvatar: insertBlogPost.authorAvatar || null,
      image: insertBlogPost.image || null,
      readTime: insertBlogPost.readTime || null,
      published: insertBlogPost.published || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    const filtered = published !== undefined 
      ? posts.filter(post => published ? post.published === 1 : post.published === 0)
      : posts;
    return filtered.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) throw new Error('Blog post not found');
    
    const updated: BlogPost = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }

  // Dynamic Forms
  async createDynamicForm(insertForm: InsertDynamicForm): Promise<DynamicForm> {
    const id = this.currentDynamicFormId++;
    const form: DynamicForm = {
      ...insertForm,
      description: insertForm.description || null,
      active: insertForm.active || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dynamicForms.set(id, form);
    return form;
  }

  async getDynamicForms(active?: boolean): Promise<DynamicForm[]> {
    const forms = Array.from(this.dynamicForms.values());
    const filtered = active !== undefined 
      ? forms.filter(form => active ? form.active === 1 : form.active === 0)
      : forms;
    return filtered.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getDynamicForm(id: number): Promise<DynamicForm | undefined> {
    return this.dynamicForms.get(id);
  }

  async updateDynamicForm(id: number, updateData: Partial<InsertDynamicForm>): Promise<DynamicForm> {
    const existing = this.dynamicForms.get(id);
    if (!existing) throw new Error('Dynamic form not found');
    
    const updated: DynamicForm = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.dynamicForms.set(id, updated);
    return updated;
  }

  async deleteDynamicForm(id: number): Promise<void> {
    this.dynamicForms.delete(id);
  }

  // Form Submissions
  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const id = this.currentFormSubmissionId++;
    const submission: FormSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }

  async getFormSubmissions(formId?: number): Promise<FormSubmission[]> {
    const submissions = Array.from(this.formSubmissions.values());
    const filtered = formId !== undefined 
      ? submissions.filter(submission => submission.formId === formId)
      : submissions;
    return filtered.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }
}

export class DatabaseStorage implements IStorage {
  private async getDB() {
    const { db } = await import("./db");
    if (!db) {
      throw new Error("Database not available - DATABASE_URL not configured");
    }
    return db;
  }

  async getUser(id: number): Promise<User | undefined> {
    const db = await this.getDB();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDB();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await this.getDB();
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const db = await this.getDB();
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    const db = await this.getDB();
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const db = await this.getDB();
    const [enrollment] = await db
      .insert(enrollments)
      .values(insertEnrollment)
      .returning();
    return enrollment;
  }

  async getEnrollments(): Promise<Enrollment[]> {
    const db = await this.getDB();
    return await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  }

  // Blog Posts
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const db = await this.getDB();
    const [blogPost] = await db
      .insert(blogPosts)
      .values(insertBlogPost)
      .returning();
    return blogPost;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const db = await this.getDB();
    if (published !== undefined) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.published, published ? 1 : 0))
        .orderBy(desc(blogPosts.createdAt));
    }
    
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const db = await this.getDB();
    const [blogPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return blogPost || undefined;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const db = await this.getDB();
    const [blogPost] = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return blogPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    const db = await this.getDB();
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Dynamic Forms
  async createDynamicForm(insertForm: InsertDynamicForm): Promise<DynamicForm> {
    const db = await this.getDB();
    const [form] = await db
      .insert(dynamicForms)
      .values(insertForm)
      .returning();
    return form;
  }

  async getDynamicForms(active?: boolean): Promise<DynamicForm[]> {
    const db = await this.getDB();
    if (active !== undefined) {
      return await db.select().from(dynamicForms)
        .where(eq(dynamicForms.active, active ? 1 : 0))
        .orderBy(desc(dynamicForms.createdAt));
    }
    
    return await db.select().from(dynamicForms).orderBy(desc(dynamicForms.createdAt));
  }

  async getDynamicForm(id: number): Promise<DynamicForm | undefined> {
    const db = await this.getDB();
    const [form] = await db.select().from(dynamicForms).where(eq(dynamicForms.id, id));
    return form || undefined;
  }

  async updateDynamicForm(id: number, updateData: Partial<InsertDynamicForm>): Promise<DynamicForm> {
    const db = await this.getDB();
    const [form] = await db
      .update(dynamicForms)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(dynamicForms.id, id))
      .returning();
    return form;
  }

  async deleteDynamicForm(id: number): Promise<void> {
    const db = await this.getDB();
    await db.delete(dynamicForms).where(eq(dynamicForms.id, id));
  }

  // Form Submissions
  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const db = await this.getDB();
    const [submission] = await db
      .insert(formSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getFormSubmissions(formId?: number): Promise<FormSubmission[]> {
    const db = await this.getDB();
    if (formId !== undefined) {
      return await db.select().from(formSubmissions)
        .where(eq(formSubmissions.formId, formId))
        .orderBy(desc(formSubmissions.createdAt));
    }
    
    return await db.select().from(formSubmissions).orderBy(desc(formSubmissions.createdAt));
  }
}

// Dynamic storage selection to prevent MongoDB import errors
async function createStorage(): Promise<IStorage> {
  // Prioritize MONGODB_URI over DATABASE_URL
  const hasMongoURI = !!process.env.MONGODB_URI;
  const isMongoDatabase = hasMongoURI || process.env.DATABASE_URL?.includes('mongodb');
  const isDatabaseAvailable = !!process.env.DATABASE_URL;

  console.log('🔍 Database Detection:', {
    hasMongoURI,
    isMongoDatabase,
    isDatabaseAvailable,
    selectedStorage: isMongoDatabase ? 'MongoDB' : isDatabaseAvailable ? 'PostgreSQL' : 'Memory',
    MONGODB_URI: process.env.MONGODB_URI ? '[PRESENT]' : '[MISSING]',
    DATABASE_URL: process.env.DATABASE_URL ? '[PRESENT]' : '[MISSING]'
  });

  if (isMongoDatabase) {
    console.log('📦 Using MongoDB storage layer');
    try {
      const { mongoStorage } = await import("./mongodb-storage");
      return mongoStorage;
    } catch (error) {
      console.error('❌ Failed to load MongoDB storage, falling back to memory storage:', error);
      return new MemStorage();
    }
  } else if (isDatabaseAvailable) {
    console.log('📦 Using PostgreSQL storage layer');
    try {
      return new DatabaseStorage();
    } catch (error) {
      console.error('❌ Failed to load PostgreSQL storage, falling back to memory storage:', error);
      return new MemStorage();
    }
  } else {
    console.log('📦 Using in-memory storage layer');
    return new MemStorage();
  }
}

// Create storage instance lazily
let storageInstance: IStorage | null = null;

export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await createStorage();
  }
  return storageInstance;
};

// For backward compatibility, export a storage object that throws if used synchronously
export const storage = {
  async getUser(id: number) {
    const s = await getStorage();
    return s.getUser(id);
  },
  async getUserByUsername(username: string) {
    const s = await getStorage();
    return s.getUserByUsername(username);
  },
  async createUser(user: InsertUser) {
    const s = await getStorage();
    return s.createUser(user);
  },
  async createContact(contact: InsertContact) {
    const s = await getStorage();
    return s.createContact(contact);
  },
  async getContacts() {
    const s = await getStorage();
    return s.getContacts();
  },
  async createEnrollment(enrollment: InsertEnrollment) {
    const s = await getStorage();
    return s.createEnrollment(enrollment);
  },
  async getEnrollments() {
    const s = await getStorage();
    return s.getEnrollments();
  },
  async createBlogPost(blogPost: InsertBlogPost) {
    const s = await getStorage();
    return s.createBlogPost(blogPost);
  },
  async getBlogPosts(published?: boolean) {
    const s = await getStorage();
    return s.getBlogPosts(published);
  },
  async getBlogPost(id: number) {
    const s = await getStorage();
    return s.getBlogPost(id);
  },
  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>) {
    const s = await getStorage();
    return s.updateBlogPost(id, blogPost);
  },
  async deleteBlogPost(id: number) {
    const s = await getStorage();
    return s.deleteBlogPost(id);
  },
  async createDynamicForm(form: InsertDynamicForm) {
    const s = await getStorage();
    return s.createDynamicForm(form);
  },
  async getDynamicForms(active?: boolean) {
    const s = await getStorage();
    return s.getDynamicForms(active);
  },
  async getDynamicForm(id: number) {
    const s = await getStorage();
    return s.getDynamicForm(id);
  },
  async updateDynamicForm(id: number, form: Partial<InsertDynamicForm>) {
    const s = await getStorage();
    return s.updateDynamicForm(id, form);
  },
  async deleteDynamicForm(id: number) {
    const s = await getStorage();
    return s.deleteDynamicForm(id);
  },
  async createFormSubmission(submission: InsertFormSubmission) {
    const s = await getStorage();
    return s.createFormSubmission(submission);
  },
  async getFormSubmissions(formId?: number) {
    const s = await getStorage();
    return s.getFormSubmissions(formId);
  }
} as IStorage;
