import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@onealbania.com',
      password: 'Admin123!', // Will be hashed by the model hook
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:');
    console.log(`- Username: ${admin.username}`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Role: ${admin.role}`);
    console.log('Default password: Admin123!');
    console.log('Please change this password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
