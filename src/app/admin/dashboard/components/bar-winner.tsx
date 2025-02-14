"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import SelectCandidate from "./selectCandidate";

export function BarWinner() {
  const [selectedCandidate, setSelectedCandidate] = useState("adolphe");
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate new data whenever selectedCandidate changes
    const newData = [
      {
        name: "HK",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "haut-katanga",
      },
      {
        name: "HL",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "haute-lomami",
      },
      {
        name: "LLB",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "lualaba",
      },
      {
        name: "NB",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "nord-ubangi",
      },
      {
        name: "SU",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "sud-ubangi",
      },
      {
        name: "ML",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "BU",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "bas-uele",
      },
      {
        name: "EQ",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "equateur",
      },
      {
        name: "HU",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "haut-uele",
      },
      {
        name: "IT",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "ituri",
      },
      {
        name: "KS",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "kisangani",
      },
      {
        name: "KSO",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "kasai-oriental",
      },
      {
        name: "KSC",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "kasai-central",
      },
      {
        name: "KIN",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "kinshasa",
      },
      {
        name: "KC",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "KW",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "kwilu",
      },
      {
        name: "KL",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "LO",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "lomami",
      },
      {
        name: "LLB",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "lualaba",
      },
      {
        name: "MN",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "MNM",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "MG",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "NK",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "nord-kivu",
      },
      {
        name: "NU",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "nord-ubangi",
      },
      {
        name: "SNK",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "sankuru",
      },
      {
        name: "SK",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "sud-kivu",
      },
      {
        name: "TK",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "tanganyika",
      },
      {
        name: "TP",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "",
      },
      {
        name: "TSP",
        total: Math.floor(Math.random() * 5000) + 1000,
        province: "tshopo",
      },
    ].filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    setData(newData);
  }, [selectedCandidate]);

  return (
    <Card className="border-black grow h-[440px]">
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle>Tendances par provinces</CardTitle>
        <SelectCandidate
          setSelectedCandidate={setSelectedCandidate}
          selectedCandidate={selectedCandidate}
        />
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
              tick={{ fill: "#888888" }}
              angle={0}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
              tickCount={5}
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
