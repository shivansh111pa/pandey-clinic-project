import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

import * as dotenv from 'dotenv';
// Load .env.local because tsx doesn't do it automatically like Next.js does
dotenv.config({ path: '.env.local' });

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Missing MONGODB_URI in environment.');
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let admin = await User.findOne({ email });

    if (admin) {
        console.log(`Admin account ${email} already exists.`);
    } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await User.create({
            name: 'Dr. Shivansh A. Pandey',
            email,
            password: hashedPassword,
            phone: '919876543210',
            role: 'admin',
        });
        
        console.log(`Admin account ${email} created.`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
}

seed();
