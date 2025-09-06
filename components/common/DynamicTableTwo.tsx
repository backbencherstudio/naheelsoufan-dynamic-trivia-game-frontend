"use client";

import Image from "next/image";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos, MdFirstPage, MdLastPage } from "react-icons/md";

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
}

export default function DynamicTableTwo({
  columns,
  data,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onDelete,
  noDataMessage = "No data found.",
  onItemsPerPageChange,
  itemsPerPageOptions,
}: DynamicTableProps) {
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startIndex = data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, data.length);
  const rowsPerPageOptions = (itemsPerPageOptions && itemsPerPageOptions.length > 0)
    ? itemsPerPageOptions
    : [5, 10, 20, 50];

  

  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div className="overflow-hidden rounded-t-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-neutral-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ width: col.width || "auto" }}
                    className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#4a4c56] border-b border-gray-100"
                  >
                    {col.label}
                  </th>
                ))}
                {(onView || onDelete) && (
                  <th className="px-4 py-3 text-sm font-medium text-[#4a4c56] border-b border-gray-100">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? "bg-neutral-50" : "bg-white"}`}>
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="px-4 py-3 text-sm text-[#4a4c56]"
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
                            className="text-xs underline text-[#4a4c56]  cursor-pointer"
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
                    className="px-4 py-10 text-center text-[#4a4c56] text-sm"
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
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
            disabled={!onItemsPerPageChange}
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#4a4c56]">
          <span>
            {startIndex}-{endIndex} of {data.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-300 text-[#4a4c56] disabled:opacity-40"
            >
              <MdFirstPage />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-300 text-[#4a4c56] disabled:opacity-40"
            >
              <MdArrowBackIosNew />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || data.length === 0}
              className="p-1 rounded border border-gray-300 text-[#4a4c56] disabled:opacity-40"
            >
              <MdArrowForwardIos />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || data.length === 0}
              className="p-1 rounded border border-gray-300 text-[#4a4c56] disabled:opacity-40"
            >
              <MdLastPage />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
