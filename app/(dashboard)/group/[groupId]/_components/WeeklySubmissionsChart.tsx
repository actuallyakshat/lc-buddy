"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS, transformSubmissionsToChartData } from "@/lib/utils";

const chartConfig = {} satisfies ChartConfig;

// Define the props for the CustomTooltip
interface CustomTooltipProps {
  active: boolean;
  payload: {
    name: string;
    value: number;
    color: string;
    payload: { day: string };
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-300 bg-white p-3">
        <h4 className="font-medium">{`Submissions on ${payload[0].payload.day}`}</h4>
        {payload.map((entry, index) => {
          if (entry.value >= 0) {
            return (
              <p
                key={`item-${index}`}
                style={{ color: entry.color }}
                className="mt-1.5"
              >
                {`${entry.name}: ${entry.value}`}
              </p>
            );
          }
          return null; // Skip rendering for users with zero submissions
        })}
      </div>
    );
  }
  return null;
};

export function WeeklySubmissionsChart(data: any) {
  const chartData = transformSubmissionsToChartData(data.data);
  console.log(chartData);

  // Get the list of users with their submission counts
  const users = Object.keys(chartData[0]).filter((key) => key !== "day");

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Weekly Submissions Report</CardTitle>
        <CardDescription>
          This chart shows the weekly submissions of all members of this group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <Tooltip
              content={<CustomTooltip active={false} payload={[]} />}
              cursor={false}
            />

            {users.map((username, index) => {
              const hasSubmissions = chartData.some(
                (dataPoint) => Number(dataPoint[username]) > 0, // Ensure comparison with a number
              );

              if (hasSubmissions) {
                return (
                  <Area
                    key={index}
                    dataKey={username}
                    type="linear"
                    fill={COLORS[index % 10]}
                    fillOpacity={0.5}
                    stroke={"none"}
                    stackId="a"
                    dot={false}
                    activeDot={true}
                  />
                );
              }
              return null; // Skip rendering for users with zero submissions
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
