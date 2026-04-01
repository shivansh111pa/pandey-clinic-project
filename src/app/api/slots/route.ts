import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
import { getAvailableSlots } from '@/lib/slots';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const doctorId = searchParams.get('doctorId');

    if (!dateStr || !doctorId) {
      return NextResponse.json({ error: 'Missing date or doctorId' }, { status: 400 });
    }

    const date = new Date(dateStr);
    
    // Parse strictly from string to avoid UTC-offset timezone bugs matching the local day
    const parts = dateStr.split('-');
    const localDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = localDate.getDay();

    await dbConnect();

    let schedule = await Schedule.findOne({ doctorId, dayOfWeek });
    
    // Auto-create standard schedule if none exists to allow immediate booking
    if (!schedule) {
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
      
      // We only insert if we can't find ANY schedule for this doctor just to be perfectly safe
      const existing = await Schedule.countDocuments({ doctorId });
      if (existing === 0) {
        await Schedule.insertMany(newSchedules);
        schedule = await Schedule.findOne({ doctorId, dayOfWeek });
      }
    }
    if (!schedule || !schedule.isActive) {
      return NextResponse.json({ slots: [] }, { status: 200 });
    }

    // Get exact date bounds for the query
    const startOfDay = new Date(dateStr);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const slots = getAvailableSlots(schedule, existingAppointments, startOfDay);
    const walkInBlocks = schedule.slots.filter((s: any) => s.type === 'walk-in');

    return NextResponse.json({ slots, walkInBlocks }, { status: 200 });
  } catch (error: any) {
    console.error('Available Slots API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
