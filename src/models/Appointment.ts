import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no-show';
  problemDescription: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled', 'no-show'],
      default: 'booked',
    },
    problemDescription: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

AppointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });
AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default Appointment;
