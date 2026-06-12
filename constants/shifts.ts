import { Shift } from "@/types/schedule";

export const DEFAULT_SHIFTS: Shift[] = [
  {
    name: "Shift 1",
    startTime: "08:00",
    endTime: "17:00",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    name: "Shift 2",
    startTime: "09:00",
    endTime: "18:00",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    name: "Shift 3",
    startTime: "13:00",
    endTime: "22:00",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
];

export const SHIFT_COLORS = [
  {
    label: "Blue",
    value: "bg-blue-100 text-blue-800 border-blue-300",
    preview: "bg-blue-100 border-blue-300",
  },

  {
    label: "Green",
    value: "bg-green-100 text-green-800 border-green-300",
    preview: "bg-green-100 border-green-300",
  },

  {
    label: "Yellow",
    value: "bg-yellow-100 text-yellow-800 border-yellow-300",
    preview: "bg-yellow-100 border-yellow-300",
  },

  {
    label: "Red",
    value: "bg-red-100 text-red-800 border-red-300",
    preview: "bg-red-100 border-red-300",
  },

  {
    label: "Purple",
    value: "bg-purple-100 text-purple-800 border-purple-300",
    preview: "bg-purple-100 border-purple-300",
  },
];
