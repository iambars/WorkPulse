// ---------------- helpers ----------------

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    // year: "numeric",
  });

export const getWorkedHours = (inT: string, outT: string, breakH: number) => {
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);

  const startMinutes = ih * 60 + im;
  let endMinutes = oh * 60 + om;

  // For night shifts (Crosses midnight)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const workedHours = (endMinutes - startMinutes) / 60;

  return Math.max(0, workedHours - breakH);
};

export const getRegularHours = (workedHours: number, isRestDay: boolean) => {
  if (isRestDay) return null;
  return Math.min(workedHours, 8);
};

export const getOT = (workedHours: number, isRestDay: boolean) => {
  if (isRestDay) return workedHours;

  const ot = workedHours - 8;

  return ot > 0 ? ot : null;
};

export type Row = {
  date: string;
  isRestDay: boolean;
  shiftName?: string;
  color?: string;
  scheduledIn?: string;
  scheduledOut?: string;
  timeIn?: string;
  timeOut?: string;
  breakHours: number;
  remarks?: string;
};

export const getAttendanceMetrics = (
  row: Row,
  attendance: Record<
    string,
    {
      timeIn: string;
      timeOut: string;
    }
  >,
) => {
  const timeIn = attendance[row.date]?.timeIn ?? "";
  const timeOut = attendance[row.date]?.timeOut ?? "";

  const workedHours =
    timeIn && timeOut ? getWorkedHours(timeIn, timeOut, row.breakHours) : null;

  const hours =
    workedHours !== null ? getRegularHours(workedHours, row.isRestDay) : null;

  const ot = workedHours !== null ? getOT(workedHours, row.isRestDay) : null;

  return {
    timeIn,
    timeOut,
    workedHours,
    hours,
    ot,
  };
};

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "Rest Day":
      return "text-gray-600 bg-gray-100";
    case "Late":
    case "Late & Undertime":
      return "text-red-600 bg-red-50";
    case "Present":
      return "text-green-700 bg-green-50";
    case "Undertime":
      return "text-yellow-700 bg-yellow-50";
    default:
      return "text-gray-600";
  }
};

export const getStatus = (row: Row, timeIn: string, hours: number | null) => {
  if (row.isRestDay) return "Rest Day";
  if (!row.scheduledIn || !timeIn || hours === null) return "Unknown";

  const [sh, sm] = row.scheduledIn.split(":").map(Number);
  const [ih, im] = timeIn.split(":").map(Number);

  const isLate = ih * 60 + im > sh * 60 + sm;
  const isUndertime = hours < 8;

  if (isLate && isUndertime) return "Late & Undertime";
  if (isLate) return "Late";
  if (isUndertime) return "Undertime";
  return "Present";
};
