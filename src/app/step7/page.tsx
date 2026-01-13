"use client";

import { payments, Payment } from "@/data/mockData";
import Link from "next/link";
import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  Column,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Download } from "lucide-react";

// --- Components ---

const StatusBadge = ({ status }: { status: Payment['status'] }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 ring-1 ring-green-600/20',
    pending: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20',
    processing: 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20',
    failed: 'bg-red-100 text-red-800 ring-1 ring-red-600/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- Filter Component ---

function FilterInput({
  column,
}: {
  column: Column<Payment, unknown>;
}) {
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

// --- Table Configuration ---

const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-mono text-gray-900">{info.getValue()}</span>,
    meta: { sticky: "left" },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => <div className="text-right font-medium text-gray-900">${info.getValue().toFixed(2)}</div>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => <span className="text-gray-500 whitespace-nowrap">{new Date(info.getValue()).toLocaleDateString()}</span>,
  }),
];

// --- Helper Functions ---

const downloadCSV = (rows: any[]) => {
  if (rows.length === 0) return;

  const headers = ["ID", "Status", "Email", "Amount", "Created At"];
  const csvContent = [
    headers.join(","),
    ...rows.map(row => {
      const p = row.original as Payment;
      return [
        p.id,
        p.status,
        p.email,
        p.amount,
        new Date(p.createdAt).toISOString()
      ].join(",");
    })
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "payments_export.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Page ---

export default function Step7Page() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto h-screen flex flex-col">
      <div className="flex-none mb-6 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Step 7: CSV Export</h1>
           <p className="text-gray-500">Download filtered data as CSV file.</p>
        </div>
        <div className="flex items-center gap-4">
             <button
                onClick={() => downloadCSV(table.getFilteredRowModel().rows)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
             >
                <Download className="w-4 h-4" />
                Download CSV
             </button>
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Back to Home</Link>
        </div>
      </div>

      <div className="flex-none p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-6 shadow-sm text-indigo-900">
        <p className="font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" />
            Learning Point
        </p>
        <p className="text-sm mt-1">
            We use <code>table.getFilteredRowModel().rows</code> to get the data <strong>currently visible</strong> after filtering.
            Then we generate a Blob object and simulate a click on an invisible link to trigger the download. 
            All done client-side!
        </p>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 border rounded-xl overflow-auto shadow-sm bg-white relative">
        <table className="w-full text-left text-sm border-separate border-spacing-0">
          <thead className="bg-gray-50 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isStickyLeft = header.column.id === 'id';
                  return (
                    <th
                      key={header.id}
                      className={`
                        px-6 py-4 font-semibold text-gray-900 border-b border-gray-200 align-top
                        sticky top-0 bg-gray-50 
                        ${isStickyLeft ? 'sticky left-0 z-30 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]' : 'z-20'}
                        
                        ${header.column.getCanSort() ? "cursor-pointer select-none hover:bg-gray-100" : ""}
                      `}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                            asc: <ArrowUpDown className="w-3 h-3 text-gray-900" />,
                            desc: <ArrowUpDown className="w-3 h-3 text-gray-900" />,
                            }[header.column.getIsSorted() as string] ?? 
                            (header.column.getCanSort() ? <ArrowUpDown className="w-3 h-3 text-gray-300" /> : null)}
                        </div>

                        {header.column.getCanFilter() ? (
                          <div className="mt-1">
                            <FilterInput column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group hover:bg-gray-50/80 transition-colors">
                {row.getVisibleCells().map((cell) => {
                   const isStickyLeft = cell.column.id === 'id';
                   return (
                    <td 
                        key={cell.id} 
                        className={`
                            px-6 py-3 whitespace-nowrap
                            ${isStickyLeft 
                                ? 'sticky left-0 bg-white group-hover:bg-gray-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10' 
                                : 'bg-transparent'
                            }
                        `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                   );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex-none pt-4 flex items-center justify-between border-t mt-4 border-gray-100">
        <div className="text-sm text-gray-500">
             Showing {table.getFilteredRowModel().rows.length} rows
        </div>
        <div className="flex items-center gap-2">
            <button
                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">Page {table.getState().pagination.pageIndex + 1}</span>
            <button
                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}
