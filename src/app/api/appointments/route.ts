import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import { bookingSchema } from '@/lib/validators';
import { bookingConfirmationEmail, sendEmail } from '@/lib/email';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { date, startTime, endTime, problemDescription } = result.data;
    const doctorId = body.doctorId;

    if (!doctorId) {
      return NextResponse.json({ error: 'Missing doctorId' }, { status: 400 });
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    // Pre-check for clear conflicts (though the index guarantees safety)
    const existing = await Appointment.findOne({
      doctorId,
      date: startOfDay,
      startTime,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This time slot was just booked by someone else. Please select another time.' },
        { status: 409 }
      );
    }

    // Rely on atomic uniqueness of the compound index to prevent race conditions natively
    const appointment = await Appointment.create({
      doctorId,
      patientId: session.user.id,
      date: startOfDay,
      startTime,
      endTime,
      problemDescription,
      status: 'booked',
    });

    // Send confirmation email asynchronously
    const patient = await User.findById(session.user.id);
    if (patient?.email) {
      const formattedDate = startOfDay.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      
      sendEmail({
          to: patient.email,
          subject: 'Appointment Confirmed - Pandey Care',
          html: bookingConfirmationEmail(patient.name, formattedDate, startTime, problemDescription)
      }).catch(console.error);
    }

    return NextResponse.json(
      { message: 'Appointment booked successfully', appointmentId: appointment._id },
      { status: 201 }
    );

  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
         { error: 'This time slot was just booked by someone else. Please select another time.' },
         { status: 409 }
      );
    }
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
