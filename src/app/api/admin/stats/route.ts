import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Prescription from '@/models/Prescription';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const doctorId = session.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await Appointment.countDocuments({
      doctorId,
      date: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    });

    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    const uncompletedAppointments = await Appointment.countDocuments({
        doctorId,
        status: 'booked'
    });

    const totalPrescriptions = await Prescription.countDocuments({ doctorId });

    return NextResponse.json({
        stats: {
           appointmentsToday,
           totalPatients,
           uncompletedAppointments,
           totalPrescriptions
        }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
