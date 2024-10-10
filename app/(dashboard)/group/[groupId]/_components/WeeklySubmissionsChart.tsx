"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS, transformSubmissionsToChartData } from "@/lib/utils";

const chartConfig = {} satisfies ChartConfig;

export function WeeklySubmissionsChart(data: any) {
  const chartData = transformSubmissionsToChartData(data.data);
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

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {data.data.map((userData: any, index: number) => {
              return (
                <Area
                  key={index}
                  dataKey={userData.username}
                  type="linear"
                  fill={COLORS[index % 10]}
                  fillOpacity={0.4}
                  stroke={"none"}
                  stackId="a"
                  dot={false}
                  activeDot={true}
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
