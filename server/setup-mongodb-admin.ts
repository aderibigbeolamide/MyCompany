import { connectToDatabase } from './mongodb';
import { User } from '../shared/mongodb-schema';
import bcrypt from 'bcrypt';

async function setupMongoDBAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ No MONGODB_URI found - skipping MongoDB admin setup');
      return;
    }

    console.log('🔧 Setting up MongoDB admin user...');
    await connectToDatabase();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ MongoDB admin user created successfully');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    
  } catch (error) {
    console.error('❌ Error setting up MongoDB admin:', error);
  }
}

setupMongoDBAdmin();