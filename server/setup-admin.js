// Setup script to create the default admin user
// Run with: node server/setup-admin.js

import bcrypt from 'bcrypt';
import { db } from './db.js';
import { users } from '../shared/schema.js';

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // Change this in production
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, adminUsername));
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();