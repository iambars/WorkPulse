export const tabs = [
  "Schedule",
  "Attendance",
  "Adjustments",
  "Summary",
  "Preferences",
] as const;

export type Tab = (typeof tabs)[number];
