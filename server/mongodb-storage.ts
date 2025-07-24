import { connectToDatabase } from './mongodb';
import { 
  Contact, Enrollment, User, BlogPost, DynamicForm, FormSubmission,
  IContact, IEnrollment, IUser, IBlogPost, IDynamicForm, IFormSubmission,
  InsertContact, InsertEnrollment, InsertUser, InsertBlogPost, InsertDynamicForm, InsertFormSubmission
} from '@shared/mongodb-schema';
import bcrypt from 'bcrypt';

export class MongoDBStorage {
  constructor() {
    // Only connect if we have a valid MongoDB URI
    if (process.env.MONGODB_URI) {
      connectToDatabase().catch(console.error);
    }
  }

  // Contact methods
  async createContact(data: InsertContact): Promise<IContact> {
    await connectToDatabase();
    const contact = new Contact(data);
    return await contact.save();
  }

  async getContacts(): Promise<IContact[]> {
    await connectToDatabase();
    return await Contact.find().sort({ createdAt: -1 });
  }

  // Enrollment methods
  async createEnrollment(data: InsertEnrollment): Promise<IEnrollment> {
    await connectToDatabase();
    const enrollment = new Enrollment(data);
    return await enrollment.save();
  }

  async getEnrollments(): Promise<IEnrollment[]> {
    await connectToDatabase();
    return await Enrollment.find().sort({ createdAt: -1 });
  }

  // User methods
  async createUser(data: InsertUser): Promise<IUser> {
    await connectToDatabase();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      ...data,
      password: hashedPassword
    });
    return await user.save();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await connectToDatabase();
    return await User.findOne({ username });
  }

  async validateUser(username: string, password: string): Promise<IUser | null> {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  // Blog Post methods
  async createBlogPost(data: InsertBlogPost): Promise<IBlogPost> {
    await connectToDatabase();
    const blogPost = new BlogPost({
      ...data,
      updatedAt: new Date()
    });
    return await blogPost.save();
  }

  async getBlogPosts(published?: boolean): Promise<IBlogPost[]> {
    await connectToDatabase();
    const filter = published !== undefined ? { published: published ? 1 : 0 } : {};
    return await BlogPost.find(filter).sort({ createdAt: -1 });
  }

  async getBlogPostById(id: string): Promise<IBlogPost | null> {
    await connectToDatabase();
    return await BlogPost.findById(id);
  }

  // Legacy method for compatibility with existing interface
  async getBlogPost(id: string | number): Promise<IBlogPost | null> {
    await connectToDatabase();
    return await BlogPost.findById(id.toString());
  }

  async updateBlogPost(id: string | number, data: Partial<InsertBlogPost>): Promise<IBlogPost | null> {
    await connectToDatabase();
    return await BlogPost.findByIdAndUpdate(
      id.toString(), 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    );
  }

  async deleteBlogPost(id: string | number): Promise<void> {
    await connectToDatabase();
    await BlogPost.findByIdAndDelete(id.toString());
  }

  // Dynamic Form methods
  async createDynamicForm(data: InsertDynamicForm): Promise<IDynamicForm> {
    await connectToDatabase();
    const form = new DynamicForm({
      ...data,
      updatedAt: new Date()
    });
    return await form.save();
  }

  async getDynamicForms(active?: boolean): Promise<IDynamicForm[]> {
    await connectToDatabase();
    const filter = active !== undefined ? { active: active ? 1 : 0 } : {};
    return await DynamicForm.find(filter).sort({ createdAt: -1 });
  }

  async getDynamicFormById(id: string): Promise<IDynamicForm | null> {
    await connectToDatabase();
    return await DynamicForm.findById(id);
  }

  // Legacy method for compatibility with existing interface
  async getDynamicForm(id: string | number): Promise<IDynamicForm | null> {
    await connectToDatabase();
    return await DynamicForm.findById(id.toString());
  }

  async updateDynamicForm(id: string | number, data: Partial<InsertDynamicForm>): Promise<IDynamicForm | null> {
    await connectToDatabase();
    return await DynamicForm.findByIdAndUpdate(
      id.toString(), 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    );
  }

  async deleteDynamicForm(id: string | number): Promise<void> {
    await connectToDatabase();
    await DynamicForm.findByIdAndDelete(id.toString());
  }

  // Form Submission methods
  async createFormSubmission(data: InsertFormSubmission): Promise<IFormSubmission> {
    await connectToDatabase();
    const submission = new FormSubmission(data);
    return await submission.save();
  }

  async getFormSubmissions(): Promise<IFormSubmission[]> {
    await connectToDatabase();
    return await FormSubmission.find().sort({ createdAt: -1 });
  }

  async getFormSubmissionsByFormId(formId: string): Promise<IFormSubmission[]> {
    await connectToDatabase();
    return await FormSubmission.find({ formId }).sort({ createdAt: -1 });
  }
}

export const mongoStorage = new MongoDBStorage();