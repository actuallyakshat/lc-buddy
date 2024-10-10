"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS, transformSubmissionsToChartData } from "@/lib/utils";

const chartConfig = {} satisfies ChartConfig;

function getDateWeek(date?: Date): number {
  const currentDate: Date = date instanceof Date ? date : new Date();
  const januaryFirst: Date = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday: number =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday: Date = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday,
  );

  return currentDate < nextMonday
    ? 52
    : currentDate > nextMonday
      ? Math.ceil(
          (currentDate.getTime() - nextMonday.getTime()) /
            (24 * 3600 * 1000) /
            7,
        )
      : 1;
}

interface SubmissionData {
  username: string;
  submissions: {
    [key: string]: number;
  };
}

function sumAllSubmissions(data: SubmissionData[]): number {
  let totalSum = 0;

  data.forEach((user) => {
    Object.values(user.submissions).forEach((submissionCount) => {
      totalSum += submissionCount;
    });
  });

  return totalSum;
}

type UserSubmissionSummary = {
  name: string;
  total: number;
};

function getUserSubmissionsSummaries(data: any): UserSubmissionSummary[] {
  const result = data.data.map((user: any) => ({
    name: user.username,
    value: (Object.values(user.submissions) as number[]).reduce(
      (acc: number, curr: number) => acc + curr,
      0,
    ),
  }));
  return result;
}

export function SubmissionsConrtibutionPieChart(data: any) {
  const total = sumAllSubmissions(data.data);
  const pieChartData = getUserSubmissionsSummaries(data);
  const isDataEmpty = pieChartData
    .map((data: any) => data.value)
    .every((value) => value === 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Submissions</CardTitle>
        <CardDescription>Week {getDateWeek(new Date())}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px] flex-1 md:min-h-0">
        {!isDataEmpty ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart width={400} height={400}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="w-full max-w-full" />}
              />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Submissions
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              This group has made no submissions this week.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
