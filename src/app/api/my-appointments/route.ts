import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const appointments = await Appointment.find({ patientId: session.user.id })
      .sort({ date: -1, startTime: -1 }) // Newest first
      .populate('doctorId', 'name')
      .lean();

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Fetch Appointments Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
