import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import Prescription from '@/models/Prescription';
import { prescriptionSchema } from '@/lib/validators';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { generateWhatsAppLink, prescriptionWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const result = prescriptionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const doctorId = session.user.id;
    const { appointmentId, diagnosis, medications, additionalNotes } = result.data;

    const appointment = await Appointment.findById(appointmentId).populate('patientId');
    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });

    const patient = appointment.patientId as any;

    const existingPrec = await Prescription.findOne({ appointmentId });
    if(existingPrec) return NextResponse.json({ error: 'Prescription already exists' }, { status: 400 });

    const prescription = await Prescription.create({
      appointmentId,
      doctorId,
      patientId: patient._id,
      diagnosis,
      medications,
      additionalNotes
    });

    // Mark appointment as completed
    appointment.status = 'completed';
    await appointment.save();

    // Prepare WhatsApp link
    const formattedDate = new Date(appointment.date).toLocaleDateString();
    const waMessage = prescriptionWhatsAppMessage(patient.name, session.user.name, formattedDate);
    const waLink = generateWhatsAppLink(patient.phone, waMessage);

    // Send email notification (async)
    sendEmail({
        to: patient.email,
        subject: `Your Prescription from Dr. ${session.user.name}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #f43f5e;">Prescription Ready</h2>
                <p>Hello ${patient.name},</p>
                <p>Your prescription from your visit on ${formattedDate} is now available.</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/my-appointments" style="background:#f43f5e;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Log in to download PDF</a></p>
            </div>
        `
    });

    return NextResponse.json({ 
        message: 'Prescription created successfully', 
        prescriptionId: prescription._id,
        whatsappLink: waLink
    }, { status: 201 });

  } catch (error) {
    console.error('Prescription POST API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
