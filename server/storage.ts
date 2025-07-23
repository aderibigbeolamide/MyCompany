import { contacts, enrollments, users, type Contact, type Enrollment, type User, type InsertContact, type InsertEnrollment, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollments(): Promise<Enrollment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private enrollments: Map<number, Enrollment>;
  private currentUserId: number;
  private currentContactId: number;
  private currentEnrollmentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.enrollments = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentEnrollmentId = 1;
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
    const user: User = { ...insertUser, id };
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
}

export const storage = new MemStorage();
