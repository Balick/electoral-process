"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const data = [
  {
    name: "HK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "HL",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "LLB",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "NB",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "SU",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "ML",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "BU",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "EQ",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "HU",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "IT",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KS",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KSO",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KSC",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KIN",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KC",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KW",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "KL",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "LO",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "LLB",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "MN",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "MNM",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "MG",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "NK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "NU",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "SNK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "SK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "NK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "TK",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "TP",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "TSP",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function BarWinner() {
  return (
    <Card className="border-black grow h-[440px]">
      <CardHeader>
        <CardTitle>Tendances par provinces</CardTitle>
      </CardHeader>
      <CardContent className="h-auto">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
