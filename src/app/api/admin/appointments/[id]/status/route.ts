import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { status } = await req.json();

    const validStatuses = ['booked', 'confirmed', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully', appointment }, { status: 200 });
  } catch (error) {
    console.error('Update Appointment Status API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
