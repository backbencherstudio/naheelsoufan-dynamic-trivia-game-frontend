"use client";

import Image from "next/image";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos, MdFirstPage, MdLastPage } from "react-icons/md";
import Loader from "../reusable/Loader";

interface ColumnConfig {
  label: React.ReactNode;
  width: any;
  accessor: string;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: any;
  data: any[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView?: (row: any) => void;
  onDelete?: (id: any) => void;
  noDataMessage?: string;
  onItemsPerPageChange?: (size: number) => void;
  itemsPerPageOptions?: number[];
  paginationData?: any;
  loading?: boolean;
}

export default function DynamicTableTwo({
  columns,
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onDelete,
  paginationData,
  noDataMessage = "No data found.",
  onItemsPerPageChange,
  loading,
}: DynamicTableProps) {


  let rowsPerPageOptions = [5, 10, 20, 50];

  rowsPerPageOptions.unshift(itemsPerPage)

  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div className="overflow-hidden rounded-t-md border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-neutral-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ width: col.width || "auto" }}
                    className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#4a4c56] border-b border-gray-100 dark:border-gray-700 dark:bg-blackColor dark:text-whiteColor"
                  >
                    {col.label}
                  </th>
                ))}
                {(onView || onDelete) && (
                  <th className="px-4 py-3 text-sm font-medium text-[#4a4c56] border-b border-gray-100 dark:border-gray-700 dark:text-whiteColor">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="">
              { loading ? <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-[#4a4c56] text-sm dark:text-whiteColor">
                  <Loader/>
                </td>
              </tr> : data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? "bg-neutral-50" : "bg-white"} dark:bg-blackColor dark:border-gray-900`}>
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="px-4 py-3 text-sm text-[#4a4c56] dark:text-whiteColor"
                      >
                        {col.formatter
                          ? col.formatter(row[col.accessor], row,(currentPage - 1) * itemsPerPage + i)
                          : row[col.accessor]}
                      </td>
                    ))}
                    {(onView || onDelete) && (
                      <td className="px-4 py-3 flex gap-4 items-center">
                        {onView && (
                          <span
                            className="text-xs underline text-[#4a4c56]  cursor-pointer dark:text-whiteColor"
                            onClick={() => onView(row)}
                          >
                            View details
                          </span>
                        )}
                        {onDelete && (
                          <Image
                            onClick={() => onDelete(row.id)}
                            src="/dashboard/icon/delete.svg"
                            alt="delete"
                            width={16}
                            height={16}
                            className="cursor-pointer"
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-[#4a4c56] text-sm dark:text-whiteColor"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mt-6 pr-6">
        <div className="flex items-center gap-2 text-sm text-[#4a4c56]">
          <span>Rows per page:</span>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm dark:border-gray-700 dark:text-whiteColor"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
            disabled={!onItemsPerPageChange}
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}  className="dark:text-whiteColor dark:bg-blackColor" >{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#4a4c56] dark:text-whiteColor">
          <span>
            {currentPage * itemsPerPage - itemsPerPage + 1}-{itemsPerPage * currentPage} of {paginationData?.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={!paginationData?.hasPreviousPage}
              className="p-1 rounded border disabled:cursor-not-allowed border-gray-300 text-[#4a4c56] disabled:opacity-40 dark:border-gray-700 dark:text-whiteColor"
            >
              <MdFirstPage className="dark:text-whiteColor"/>
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!paginationData?.hasPreviousPage}
              className="p-1 rounded border disabled:cursor-not-allowed border-gray-300 text-[#4a4c56] disabled:opacity-40 dark:border-gray-700 dark:text-whiteColor"
            >
              <MdArrowBackIosNew className="dark:text-whiteColor" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!paginationData?.hasNextPage}
              className="p-1 rounded border disabled:cursor-not-allowed border-gray-300 text-[#4a4c56] disabled:opacity-40 dark:border-gray-700 dark:text-whiteColor"
            >
              <MdArrowForwardIos className="dark:text-whiteColor" />
            </button>
            <button
              onClick={() => onPageChange(paginationData?.totalPages)}
              disabled={!paginationData?.hasNextPage}
              className="p-1 rounded border disabled:cursor-not-allowed border-gray-300 text-[#4a4c56] disabled:opacity-40"
            >
              <MdLastPage className="dark:text-whiteColor"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
