// Simple script to create admin user using the current storage system
import express from 'express';
import { storage } from './storage.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...');
    
    // Check if admin exists
    const existingAdmin = await storage.getUserByUsername('admin');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const adminUser = await storage.createUser({
      username: 'admin',
      password: 'admin123', // Let storage handle hashing
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully:', {
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role
    });
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
  
  process.exit(0);
}

createAdmin();