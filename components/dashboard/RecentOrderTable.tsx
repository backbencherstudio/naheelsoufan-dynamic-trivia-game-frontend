"use client";
import Link from "next/link";
import { useState } from "react";
import { FaPen } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import DynamicTableTwo from "../common/DynamicTableTwo";

function RecentOrderTable({ recentOrder }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Demo data matching subscription types from the image
  const recentData = [
    { 
      no: 1, 
      typeName: "pilot", 
      price: "50", 
      players: "4", 
      games: "2", 
      languages: "English", 
      questions: "10" 
    },
    { 
      no: 2, 
      typeName: "3 games", 
      price: "21", 
      players: "4", 
      games: "3", 
      languages: "English", 
      questions: "10" 
    },
    { 
      no: 3, 
      typeName: "One Game", 
      price: "7.5", 
      players: "4", 
      games: "1", 
      languages: "English", 
      questions: "10" 
    },
    { 
      no: 4, 
      typeName: "لعبة واحدة", 
      price: "$50", 
      players: "4", 
      games: "1", 
      languages: "عربي", 
      questions: "10" 
    },
    { 
      no: 5, 
      typeName: "1 game 2players", 
      price: "20", 
      players: "2", 
      games: "1", 
      languages: "English", 
      questions: "3" 
    },
  ];


  
const columns = [
    {
      label: "No",
      accessor: "no",
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: "Type Name",
      accessor: "typeName",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Price",
      accessor: "price",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Players",
      accessor: "players",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Games",
      accessor: "games",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Languages",
      accessor: "languages",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Questions",
      accessor: "questions",
      width: "90px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      width: "100px",
      formatter: (_: any, record: any) => {
        return (
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleEdit(record)}
              className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'
            >
              <FaPen />
            </button>
            <button 
              onClick={() => handleDelete(record)}
              className='text-xl cursor-pointer text-red-600 hover:text-red-800'
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        );
      },
    },
  ];

  const handleEdit = (record: any) => {
    console.log("Editing record:", record);
  };

  const handleDelete = (record: any) => {
    console.log("Deleting record:", record);
  };

  return (
    <section>
      <div className="border p-5 rounded-md">
        <div className=" flex justify-between items-center pb-4">
          <h4 className="text-xl lg:text-2xl font-medium text-headerColor ">
            Subscription Types
          </h4>
          <div>
            <Link
              href="/dashboard/subscription-types"
              className="cursor-pointer text-headerColor border rounded-md text-sm flex items-center gap-2 px-[14px] py-2"
            >
              {" "}
              View All
            </Link>
          </div>
        </div>
        <DynamicTableTwo
          columns={columns}
          data={recentData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          itemsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </section>
  );
}

export default RecentOrderTable;
