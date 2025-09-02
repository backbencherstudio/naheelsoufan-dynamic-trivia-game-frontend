"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";


const currentMonth = new Date().toLocaleString("default", { month: "short" });
const currentYear = new Date().getFullYear();

export function HomeBarChart({subscriberStatistics}:any) {
  const [selectedYear, setSelectedYear] = useState(`${currentYear}`);

  const filteredData = subscriberStatistics?.data?.filter(
    (entry) => `${entry.year}` === selectedYear
  );

  return (
    <Card className=" shadow-none h-[443px] flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm text-descriptionColor font-medium">
              Total Subscriber
            </h4>
            <div className="flex gap-2 items-center leading-none">
              <h5 className="font-bold text-2xl">100</h5>{" "}
              <span className="rounded-full bg-greenColor/15 border border-greenColor flex justify-center items-center px-2 gap-1 text-[10px] py-1 text-greenColor">
                10% <TrendingUp className="h-3 w-3 text-greenColor" />{" "}
              </span>
            </div>
          </div>
          <div>
            <Select onValueChange={(value) => setSelectedYear(value)}>
              <SelectTrigger className="w-[100px] focus-visible:ring-0">
                <SelectValue placeholder="Yearly" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2026</SelectItem>
                <SelectItem value="2023">2027</SelectItem>
                <SelectItem value="2022">2028</SelectItem>
                <SelectItem value="2021">2029</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
      {filteredData.length > 0 ? <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData} >
          <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3"  />
          <XAxis
            className="text-sm"
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const value = payload[0].payload.subscription;
              const month = payload[0].payload.month;
              const year = payload[0].payload.year;
              return (
                <div className="rounded-md shadow-[#EFF3FF] bg-white p-2  shadow-xl text-xs">
                  <h5 className="text-xs font-semibold">{month} {year}</h5>
                  <p className="text-[10px] font-semibold text-pragaraphColor">
                    <span className="text-[#93979A]">This Month:</span> {value} Subscription
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="subscription" radius={[8, 8, 8, 8]}>
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.month === currentMonth && `${entry.year}` === `${currentYear}` ? "#1141CB" : "#EBF0FE"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>   : <div className="h-28">No data found !</div>}
       
      </CardContent>
    </Card>
  );
}
