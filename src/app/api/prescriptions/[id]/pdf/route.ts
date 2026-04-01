import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Prescription from '@/models/Prescription';
import Appointment from '@/models/Appointment';
import { renderToStream } from '@react-pdf/renderer';
import PrescriptionPDF from '@/components/prescription/PrescriptionPDF';
import React from 'react';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if ID is an appointment ID or a prescription ID
    // We typically click "Download PDF" from the appointment, so params.id is likely the appointmentId
    let prescription = await Prescription.findOne({ appointmentId: params.id })
       .populate('doctorId', 'name')
       .populate('patientId', 'name phone email');
       
    if (!prescription) {
       prescription = await Prescription.findById(params.id)
         .populate('doctorId', 'name')
         .populate('patientId', 'name phone email');
    }

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Security: only admin or the patient who owns it can view it
    if (session.user.role !== 'admin' && session.user.id !== (prescription.patientId as any)._id.toString()) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const docProps = {
       clinicName: process.env.NEXT_PUBLIC_CLINIC_NAME || 'Pandey Care',
       doctorName: (prescription.doctorId as any).name,
       patientName: (prescription.patientId as any).name,
       date: new Date(prescription.createdAt).toLocaleDateString(),
       diagnosis: prescription.diagnosis,
       medications: prescription.medications,
       notes: prescription.additionalNotes
    };

    // Render PDF to a readable stream
    const stream = await renderToStream(React.createElement(PrescriptionPDF, docProps));

    // Convert React PDF stream to standard NodeJS ReadableStream for Edge/Next Response
    const webStream = new ReadableStream({
        start(controller) {
            stream.on('data', chunk => controller.enqueue(chunk));
            stream.on('end', () => controller.close());
            stream.on('error', err => controller.error(err));
        }
    });

    return new Response(webStream, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="prescription_${(prescription.patientId as any).name.replace(/\s+/g, '_')}.pdf"`
        }
    });
  } catch (error) {
    console.error('PDF Generation API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
