export const tabs = [
  "Attendance",
  "Schedule",
  "Adjustments",
  "Summary",
  "Preferences",
] as const;

export type Tab = (typeof tabs)[number];
