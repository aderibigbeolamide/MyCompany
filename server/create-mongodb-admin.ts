import { storage } from './storage';

async function createMongoDBAdmin() {
  try {
    console.log('🔧 Creating MongoDB admin user...');
    
    // Check if admin exists
    const existingAdmin = await storage.getUserByUsername('admin');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user with role
    const adminUser = await storage.createUser({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    } as any);
    
    console.log('✅ MongoDB admin user created successfully:', {
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role
    });
    
  } catch (error) {
    console.error('❌ Error creating MongoDB admin:', error);
  }
}

createMongoDBAdmin();