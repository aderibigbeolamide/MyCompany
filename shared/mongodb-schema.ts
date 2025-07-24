import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Contact Schema
const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  message: { type: String, required: true },
  newsletter: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Enrollment Schema
const enrollmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  course: { type: String, required: true },
  experience: { type: String },
  motivation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Blog Post Schema
const blogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  image: { type: String },
  readTime: { type: String },
  published: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Dynamic Form Schema
const dynamicFormSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  fields: { type: String, required: true }, // JSON string
  active: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Form Submission Schema
const formSubmissionSchema = new Schema({
  formId: { type: String, required: true },
  submissionData: { type: String, required: true }, // JSON string
  createdAt: { type: Date, default: Date.now }
});

// Interfaces
export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  newsletter: number;
  createdAt: Date;
}

export interface IEnrollment extends Document {
  name: string;
  email: string;
  phone?: string;
  course: string;
  experience?: string;
  motivation?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  createdAt: Date;
}

export interface IBlogPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author: string;
  authorAvatar?: string;
  image?: string;
  readTime?: string;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDynamicForm extends Document {
  title: string;
  description?: string;
  type: string;
  fields: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormSubmission extends Document {
  formId: string;
  submissionData: string;
  createdAt: Date;
}

// Models
export const Contact = mongoose.model<IContact>('Contact', contactSchema);
export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export const User = mongoose.model<IUser>('User', userSchema);
export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
export const DynamicForm = mongoose.model<IDynamicForm>('DynamicForm', dynamicFormSchema);
export const FormSubmission = mongoose.model<IFormSubmission>('FormSubmission', formSubmissionSchema);

// Zod Schemas for validation
export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(1),
  newsletter: z.number().optional()
});

export const insertEnrollmentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  course: z.string().min(1),
  experience: z.string().optional(),
  motivation: z.string().optional()
});

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  author: z.string().min(1),
  authorAvatar: z.string().optional(),
  image: z.string().optional(),
  readTime: z.string().optional(),
  published: z.number().optional()
});

export const insertDynamicFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  fields: z.string().min(1),
  active: z.number().optional()
});

export const insertFormSubmissionSchema = z.object({
  formId: z.string().min(1),
  submissionData: z.string().min(1)
});

// Types
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertDynamicForm = z.infer<typeof insertDynamicFormSchema>;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;