import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const appointments = await Appointment.find({ doctorId: session.user.id })
        .populate('patientId', 'name phone email')
        .sort({ date: -1, startTime: -1 })
        .lean();

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Admin Appointments API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
