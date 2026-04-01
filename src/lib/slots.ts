import { ISchedule, ISlotBlock } from '@/models/Schedule';
import { IAppointment } from '@/models/Appointment';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function generateAllSlots(
  slotBlocks: ISlotBlock[],
  duration: number
): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];

  for (const block of slotBlocks) {
    if (block.type === 'walk-in') continue;

    let current = timeToMinutes(block.startTime);
    const end = timeToMinutes(block.endTime);

    while (current + duration <= end) {
      slots.push({
        startTime: minutesToTime(current),
        endTime: minutesToTime(current + duration),
      });
      current += duration;
    }
  }

  return slots;
}

export function getAvailableSlots(
  schedule: ISchedule,
  existingAppointments: IAppointment[],
  date: Date
): TimeSlot[] {
  // Check for date-specific overrides
  const dateStr = date.toISOString().split('T')[0];
  const override = schedule.overrides?.find(
    (o) => new Date(o.date).toISOString().split('T')[0] === dateStr
  );

  // If the day is marked as off, return empty
  if (override?.isOff) {
    return [];
  }

  // Use override slots if available, otherwise use regular slots
  const slotBlocks = override?.slots || schedule.slots;
  const duration = schedule.appointmentDuration || 4;

  // Generate all possible slots
  const allSlots = generateAllSlots(slotBlocks, duration);

  // Get booked times
  const bookedTimes = new Set(
    existingAppointments
      .filter((a) => a.status !== 'cancelled')
      .map((a) => a.startTime)
  );

  // Mark availability
  return allSlots.map((slot) => {
    const isPassed = isTimePassed(slot.startTime, date);
    return {
      ...slot,
      isAvailable: !isPassed && !bookedTimes.has(slot.startTime),
    };
  });
}

export function isSlotAvailable(
  startTime: string,
  existingAppointments: IAppointment[]
): boolean {
  return !existingAppointments.some(
    (a) => a.startTime === startTime && a.status !== 'cancelled'
  );
}

export function getNextAvailableSlot(
  schedule: ISchedule,
  existingAppointments: IAppointment[],
  date: Date
): TimeSlot | null {
  const slots = getAvailableSlots(schedule, existingAppointments, date);
  return slots.find((s) => s.isAvailable) || null;
}

// Check if a given time has already passed today
export function isTimePassed(time: string, date: Date): boolean {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() > today.getTime()) return false;
  if (checkDate.getTime() < today.getTime()) return true;

  // Same day — check time
  const [hours, minutes] = time.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  return now >= slotTime;
}
