import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlotBlock {
  startTime: string;
  endTime: string;
  type?: 'booking' | 'walk-in';
}

export interface IOverride {
  date: Date;
  slots: ISlotBlock[];
  isOff: boolean;
}

export interface ISchedule extends Document {
  doctorId: mongoose.Types.ObjectId;
  dayOfWeek: number;
  slots: ISlotBlock[];
  appointmentDuration: number;
  isActive: boolean;
  overrides: IOverride[];
  createdAt: Date;
  updatedAt: Date;
}

const SlotBlockSchema = new Schema<ISlotBlock>(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ['booking', 'walk-in'], default: 'booking' },
  },
  { _id: false }
);

const OverrideSchema = new Schema<IOverride>(
  {
    date: { type: Date, required: true },
    slots: [SlotBlockSchema],
    isOff: { type: Boolean, default: false },
  },
  { _id: false }
);

const ScheduleSchema = new Schema<ISchedule>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: [SlotBlockSchema],
    appointmentDuration: { type: Number, default: 4, min: 1 },
    isActive: { type: Boolean, default: true },
    overrides: [OverrideSchema],
  },
  { timestamps: true }
);

ScheduleSchema.index({ doctorId: 1, dayOfWeek: 1 });

const Schedule: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
export default Schedule;
