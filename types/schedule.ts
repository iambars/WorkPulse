export type DaySchedule = {
  date: string;
  workDay: boolean;
  shiftId: string | null;
};

export type Shift = {
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  employeeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScheduleDayInput = {
  employeeId: string;
  date: string;
  workDay: boolean;
  isRestDay: boolean;
  shiftId: string | null;
};
