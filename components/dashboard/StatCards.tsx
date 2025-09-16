"use client"
import useDataFetch from "@/hooks/useDataFetch";
import { Loader } from "lucide-react";
import Link from "next/link";
import { RxBarChart } from "react-icons/rx";

export default function StatCards({ data }: any) {
  const { data: totalHost ,loading} = useDataFetch(`/admin/dashboard/stats`);
  console.log(totalHost?.data?.overview);
  
  const statCards = [
    {
      title: "Total Host",
      value: totalHost?.data?.overview?.totalHosts || 0,
      link: "/dashboard/subscribers",
      icon: <RxBarChart className="text-greenColor" />,
      timeFrame: "Last Month",
    },
    {
      title: "Total Users",
      value: totalHost?.data?.overview?.totalUsers || 0,
      link: "/dashboard/players",
      icon: <RxBarChart  className="text-teal-400"/>,
      timeFrame: "Last Month",
    },
    {
      title: "Total Questions",
      value: totalHost?.data?.overview?.totalQuestions || 0,
      link: "/dashboard/questions",
      icon: <RxBarChart className="text-orange-400" />,
      timeFrame: "Last Month",
    },
   
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {loading ? <Loader/> : statCards?.map((card, idx) => (
        <Link href={card.link}
          key={idx}
          className="p-4 rounded-lg border border-borderColor flex hover:shadow-[2px_2px_7px_2px_rgba(0,_0,_0,_0.08)] transition-all card flex-col gap-5"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between gap-3">
            <div className=" space-y-4">
            <h4 className="text-base lg:text-lg  font-medium text-descriptionColor dark:text-whiteColor">{card.title}</h4>
             <div className="text-2xl lg:text-[32px] font-semibold text-black dark:text-whiteColor">{card.value}</div>
            </div>
            <div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
