import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Schedule from '@/models/Schedule';
import { scheduleSchema } from '@/lib/validators';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const doctorId = session.user.id;

    let schedules = await Schedule.find({ doctorId }).sort({ dayOfWeek: 1 }).lean();
    
    // Auto-create standard schedule if none exists
    if (schedules.length === 0) {
        const defaultSlots = [
            { startTime: "09:00", endTime: "11:00", type: "booking" },
            { startTime: "11:00", endTime: "13:00", type: "walk-in" },
            { startTime: "17:00", endTime: "20:00", type: "booking" },
            { startTime: "20:00", endTime: "22:00", type: "walk-in" }
        ];
        
        const newSchedules = [];
        for (let i = 0; i < 7; i++) {
            newSchedules.push({
                doctorId,
                dayOfWeek: i,
                slots: i === 0 ? [] : [...defaultSlots], // Sunday empty by default
                isActive: i !== 0,
                appointmentDuration: 4
            });
        }
        
        await Schedule.insertMany(newSchedules);
        schedules = await Schedule.find({ doctorId }).sort({ dayOfWeek: 1 }).lean();
    }

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error('Schedule API GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const doctorId = session.user.id;
    const { dayOfWeek, slots, isActive, appointmentDuration } = await req.json();

    const result = scheduleSchema.safeParse({ dayOfWeek, slots, isActive, appointmentDuration });
    if (!result.success) {
      console.error('Schedule Zod Validation Failed:', result.error.errors);
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const updated = await Schedule.findOneAndUpdate(
        { doctorId, dayOfWeek },
        { slots, isActive, appointmentDuration },
        { new: true, upsert: true }
    );

    return NextResponse.json({ schedule: updated }, { status: 200 });
  } catch (error) {
    console.error('Schedule API PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
