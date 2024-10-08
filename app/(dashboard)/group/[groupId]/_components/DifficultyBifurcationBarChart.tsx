"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const chartConfig = {
  easy: {
    label: "Easy",
    color: "#1cbaba",
  },
  medium: {
    label: "Medium",
    color: "#ffb700",
  },
  hard: {
    label: "Hard",
    color: "#f63737",
  },
};

// Custom Tooltip component with generics
const CustomTooltip = <TValue extends ValueType, TName extends NameType>({
  active,
  payload,
  label,
}: TooltipProps<TValue, TName>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-2 shadow-lg">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

export function DifficultyBifurcationBarChart({ data }: { data: any }) {
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState<keyof typeof chartConfig>("easy");

  const chartData = data.map((user: any) => ({
    name: user.name,
    easy: user.easySolved,
    medium: user.mediumSolved,
    hard: user.hardSolved,
  }));

  const total = React.useMemo(
    () => ({
      easy: chartData.reduce((acc: number, curr: any) => acc + curr.easy, 0),
      medium: chartData.reduce(
        (acc: number, curr: any) => acc + curr.medium,
        0,
      ),
      hard: chartData.reduce((acc: number, curr: any) => acc + curr.hard, 0),
    }),
    [chartData],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Questions Solved</CardTitle>
          <CardDescription>
            A bar graph showing the number of questions solved by each member,
            categorized by difficulty.
          </CardDescription>
        </div>
        <div className="flex">
          {["easy", "medium", "hard"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={selectedDifficulty === chart}
                onClick={() => setSelectedDifficulty(chart)}
                className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6 ${
                  selectedDifficulty === chart ? "bg-muted/50" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: -20, // Reduced left margin
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#333" }} // Customize tick style
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#333" }} // Customize tick style
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              className="rounded-lg"
              dataKey={selectedDifficulty}
              fill={chartConfig[selectedDifficulty].color}
              name={chartConfig[selectedDifficulty].label}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
