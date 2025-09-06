import Image from "next/image";
import Link from "next/link";


export default function StatCards({ data }: any) {
  const statCards = [
    {
      title: "Total Host",
      value: 5,
      percentage: "+6%",
      icon: "/icon/users.svg",
      timeFrame: "Last Month",
    },
    {
      title: "Total Users",
      value: 10,
      percentage: "+6%",
      icon: "/icon/users.svg",
      timeFrame: "Last Month",
    },
    {
      title: "Total Questions",
      value: 20,
      percentage: "+6%",
      icon: "/icon/users.svg",
      timeFrame: "Last Month",
    },
   
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, idx) => (
        <Link href="#"
          key={idx}

          className="p-4 rounded-lg border border-borderColor bg-white flex hover:shadow-[2px_2px_7px_2px_rgba(0,_0,_0,_0.08)] transition-all card flex-col gap-5"
        >
          {/* Top Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E9EDFB] flex items-center justify-center">
              <Image src={card.icon} alt={card.title} width={20} height={20} />
            </div>
            <h4 className="text-base lg:text-lg  font-medium text-descriptionColor">{card.title}</h4>
          </div>


          <div className="flex flex- items-end justify-between  text-gray-500">
            <div className="text-2xl lg:text-[32px] font-semibold text-black">{card.value}</div>

            {/* <div>
            <div className="flex items-center justify-end text-greenColor text-lg lg:text-xl gap-1.5">
            <FaArrowTrendUp className=" text-greenColor  -rotate-10"/>
              {card.percentage}
            </div>
            <span  >{card.timeFrame}</span>
            </div> */}

          </div>
        </Link>
      ))}
    </div>
  );
}
