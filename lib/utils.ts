import { SubmissionData } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSolvedQuestionsThisWeek(
  submissionCalendar: {
    [timestamp: string]: number | undefined;
  },
  username: string,
) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Create an object to store the solved questions count for each day
  const solvedThisWeek: { [day: string]: number } = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  const now = new Date();
  const currentDayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, etc.
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek + 1); // Start from Monday
  startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight of Monday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday midnight
  endOfWeek.setHours(23, 59, 59, 999);

  // Iterate over the submissionCalendar and filter out undefined values
  if (submissionCalendar) {
    // Check if submissionCalendar is not null or undefined
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
      if (count !== undefined) {
        const date = new Date(parseInt(timestamp) * 1000); // Convert Unix timestamp to JS date

        if (date >= startOfWeek && date <= endOfWeek) {
          const dayName = daysOfWeek[date.getDay()]; // Get the day name
          solvedThisWeek[dayName] += count; // Add the count to the corresponding day
        }
      }
    });
  }

  return {
    username: username,
    submissions: solvedThisWeek,
  };
}

type ChartEntry = {
  day: string;
  [username: string]: number | string;
};

export function transformSubmissionsToChartData(
  submissionsArray: SubmissionData[],
): ChartEntry[] {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Initialize chart data structure with days of the week
  const chartData: ChartEntry[] = daysOfWeek.map((day) => ({ day }));

  // Iterate through each user submission data
  submissionsArray.map((userData) => {
    const { username, submissions } = userData;

    // Add user's data to the corresponding day in chartData
    chartData[0][username] = submissions.Monday;
    chartData[1][username] = submissions.Tuesday;
    chartData[2][username] = submissions.Wednesday;
    chartData[3][username] = submissions.Thursday;
    chartData[4][username] = submissions.Friday;
    chartData[5][username] = submissions.Saturday;
    chartData[6][username] = submissions.Sunday;
  });

  return chartData;
}

export const COLORS = [
  "#FFCE56",
  "#36A2EB",
  "#FF6384",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#E7FF9F",
  "#40C0FF",
  "#FFB740",
  "#B0E0E6",
];
