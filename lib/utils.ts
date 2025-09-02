import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/// event-utils.js

export function createEventId() {
  return String(Date.now() + Math.random()); // timestamp + random for uniqueness
}

const baseDate = new Date();
baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // set to current week's Sunday
const getDateStr = (dayOffset, hour, minute = 0) => {
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + dayOffset);
  date.setHours(hour, minute, 0);
  return date.toISOString().slice(0, 19);
};

export const INITIAL_EVENTS = [
  // Sunday (Sun 5/25)
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(0, 9), // 9 AM
    end: getDateStr(0, 10), // 10 AM
  },
  {
    id: createEventId(),
    title: "Tire Cleaning",
    start: getDateStr(0, 13), // 1 PM
    end: getDateStr(0, 14), // 2 PM
  },
  {
    id: createEventId(),
    title: "Engine wash",
    start: getDateStr(0, 16), // 4 PM
    end: getDateStr(0, 18), // 6 PM
  },

  // Monday
  {
    id: createEventId(),
    title: "Hand Drying",
    start: getDateStr(1, 9),
    end: getDateStr(1, 10),
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(1, 11),
    end: getDateStr(1, 12),
  },
  {
    id: createEventId(),
    title: "Exterior Wash",
    start: getDateStr(1, 15),
    end: getDateStr(1, 16),
  },

  // (Other events for the week...)
];
