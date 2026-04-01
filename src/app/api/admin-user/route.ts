import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    // In a single-doctor clinic, we just grab the first admin
    const admin = await User.findOne({ role: 'admin' }).select('_id name');
    
    if (!admin) {
      return NextResponse.json({ error: 'No doctor found' }, { status: 404 });
    }

    return NextResponse.json({ doctorId: admin._id, doctorName: admin.name }, { status: 200 });
  } catch (error) {
    console.error('Admin User API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
