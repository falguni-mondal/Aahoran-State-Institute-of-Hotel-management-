import dotenv from 'dotenv';
// Load variables from the root .env file
dotenv.config();

import mongoose from 'mongoose';
import crypto from 'crypto';
import Admin from '../models/admin.model.js';

const seedSuperAdmin = async () => {
  try {
    // 1. Connect to the database independently
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in your .env file.');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully.');

    // 2. Prevent duplicate Super Admins
    const existingSuperAdmin = await Admin.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin) {
      console.log('⚠️ A SuperAdmin account already exists in this database.');
      console.log(`Associated Email: ${existingSuperAdmin.email}`);
      console.log('Exiting without making changes...');
      process.exit(0);
    }

    // 3. Prioritize ENV variables, fallback to generated defaults if missing
    // We append specific characters to the random fallback to guarantee it passes strict regexes
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@sihm.gov.in';
    const secureRandomPassword = process.env.SUPER_ADMIN_PASSWORD || (crypto.randomBytes(12).toString('hex') + 'Xy!9');

    // 4. Create the SuperAdmin (The pre-save hook will automatically hash this password)
    const superAdmin = await Admin.create({
      email: adminEmail,
      password: secureRandomPassword,
      role: 'SuperAdmin',
      is2faEnabled: false, // Must be false so they are forced to set it up on first login
    });

    // 5. Output the critical credentials to the terminal
    console.log('\n====================================================');
    console.log('🚨 SUPER ADMIN SUCCESSFULLY GENERATED 🚨');
    console.log('====================================================');
    console.log(`Email:    ${superAdmin.email}`);
    console.log(`Password: ${secureRandomPassword}`);
    console.log('====================================================');
    console.log('⚠️ WARNING: Store this password securely immediately.');
    console.log('Because it is cryptographically hashed in the database,');
    console.log('this plain text string will NEVER be shown again.');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Execute the function
seedSuperAdmin();