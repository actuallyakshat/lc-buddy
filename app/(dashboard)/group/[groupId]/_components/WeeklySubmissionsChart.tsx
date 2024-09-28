"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

            {data.data.map((userData: any, index: number) => (
              <>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  key={index}
                  dataKey={userData.username}
                  type="linear"
                  fill={COLORS[index % 10]}
                  fillOpacity={0.4}
                  stroke={"none"}
                  stackId="a"
                />
              </>
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>

      {/* TODO: Add chart legend */}
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
