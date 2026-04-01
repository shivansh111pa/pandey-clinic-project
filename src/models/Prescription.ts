import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface IPrescription extends Document {
  appointmentId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  diagnosis: string;
  medications: IMedication[];
  additionalNotes?: string;
  followUpDate?: Date;
  pdfUrl?: string;
  sentViaEmail: boolean;
  sentViaWhatsApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema<IMedication>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    diagnosis: { type: String, required: true, trim: true },
    medications: [MedicationSchema],
    additionalNotes: { type: String, trim: true },
    followUpDate: { type: Date },
    pdfUrl: { type: String },
    sentViaEmail: { type: Boolean, default: false },
    sentViaWhatsApp: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PrescriptionSchema.index({ appointmentId: 1 }, { unique: true });
PrescriptionSchema.index({ patientId: 1 });

const Prescription: Model<IPrescription> =
  mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
export default Prescription;
