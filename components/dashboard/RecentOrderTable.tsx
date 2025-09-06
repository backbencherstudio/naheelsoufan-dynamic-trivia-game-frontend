"use client";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import DynamicTableTwo from "../common/DynamicTableTwo";

function RecentOrderTable({ recentOrder }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Demo data
  const recentData = [
    { userName: 'John Doe', serviceName: 'Cleaning', serviceType: 'Home', location: 'New York, USA', serviceDate: new Date().toISOString() },
    { userName: 'Jane Smith', serviceName: 'Plumbing', serviceType: 'Repair', location: 'Los Angeles, USA', serviceDate: new Date().toISOString() },
    { userName: 'Ali Hassan', serviceName: 'Electric', serviceType: 'Repair', location: 'Dubai, UAE', serviceDate: new Date().toISOString() },
    { userName: 'María García', serviceName: 'Gardening', serviceType: 'Outdoor', location: 'Madrid, Spain', serviceDate: new Date().toISOString() },
    { userName: 'Wei Chen', serviceName: 'Moving', serviceType: 'Logistics', location: 'Shanghai, China', serviceDate: new Date().toISOString() },
    { userName: 'Hans Müller', serviceName: 'Cleaning', serviceType: 'Office', location: 'Berlin, Germany', serviceDate: new Date().toISOString() },
    { userName: 'Sara Ahmed', serviceName: 'Babysitting', serviceType: 'Home', location: 'Cairo, Egypt', serviceDate: new Date().toISOString() },
    { userName: 'Liam O’Connor', serviceName: 'Painting', serviceType: 'Indoor', location: 'Dublin, Ireland', serviceDate: new Date().toISOString() },
  ];


  
const columns = [
    {
      label: "No",
      accessor: "no",
      width: "50px",
      formatter: (_: any, _row: any, index: number) => {
        // const serial = (currentPage - 1) * 7 + index + 1;
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    // {
    //   label: "Order Id",
    //   accessor: "id",
    //   width: "100px",
    //   formatter: (value: string) => (
    //     <div className="break-words w-[100px] text-sm leading-tight">{value}</div>
    //   ),
    // },
    {
      label: "User Name",
      accessor: "userName",
      width: "172px",
      formatter: (item) => {
        return <p className="capitalize">{item}</p>;
      },
    },
    {
      label: "Service Name",
      accessor: "serviceName",
      width: "172px",
    },
    {
      label: "Service Type",
      accessor: "serviceType",
      width: "172px",
    },
    {
      label: "Location",
      accessor: "location",
      width: "252px",
    },
    {
      label: "Service Date",
      accessor: "serviceDate",
      width: "120px",
      formatter: (value) => {
        const formattedDate = dayjs(value).format("YYYY-MM-DD");
        return <div>{formattedDate}</div>;
      },
    },
    {
      label: "Action",
      accessor: "action",
      width: "120px",
      formatter: (_: any, record: any) => {
        return (
          <span className="flex gap-2">
            <button
              className="text-base border border-primaryColor rounded-md px-5 py-2 text-primaryColor cursor-pointer disabled:cursor-not-allowed disabled:bg-pragaraphColor disabled:text-whiteColor disabled:border-0"
            >
              {"Accept"}
            </button>
            <button
           
              className="text-base bg-primaryColor rounded-md px-5 py-2 text-whiteColor cursor-pointer disabled:cursor-not-allowed disabled:bg-pragaraphColor"
            >
              {"Reject"}
            </button>
          </span>
        );
      },
    },
  ];
  return (
    <section>
      <div className="border p-5 rounded-md">
        <div className=" flex justify-between items-center pb-4">
          <h4 className="text-xl lg:text-2xl font-medium text-headerColor ">
            Our Recent Orders
          </h4>
          <div>
            <Link
              href="/dashboard/recent-order"
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
