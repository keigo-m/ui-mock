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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

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

// --- Table Configuration ---

const columnHelper = createColumnHelper<Payment>();

const columns = [
  // ID Column: Sticky Left
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

// --- Page ---

export default function Step5Page() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20, // More rows to demonstrate sticky header
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
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Step 5: Advanced UI</h1>
           <p className="text-gray-500">Sticky Headers, Sticky Columns, and Professional Styling.</p>
        </div>
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Back to Home</Link>
      </div>

      <div className="flex-none p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg mb-6 shadow-sm">
        <p className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Learning Point
        </p>
        <p className="text-sm text-gray-600 mt-1">
            We use CSS <code>sticky</code> positioning. The container has <code>overflow</code> to allow scrolling. 
            The Header (`index 0`) sticks to top. The First Column (`ID`) sticks to left. 
            <strong>Try scrolling both vertically and horizontally!</strong>
        </p>
      </div>

      {/* Main Table Container: Flex-1 to fill remaining space, overflow-auto for scrolling */}
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
                        px-6 py-4 font-semibold text-gray-900 border-b border-gray-200
                        ${/* STICKY HEADER LOGIC */ ''}
                        sticky top-0 bg-gray-50 
                        ${/* STICKY COLUMN LOGIC (Top-Left intersection needs higher Z) */ ''}
                        ${isStickyLeft ? 'sticky left-0 z-30 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]' : 'z-20'}
                        
                        ${header.column.getCanSort() ? "cursor-pointer select-none hover:bg-gray-100" : ""}
                      `}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpDown className="w-3 h-3 text-gray-900" />,
                          desc: <ArrowUpDown className="w-3 h-3 text-gray-900" />,
                        }[header.column.getIsSorted() as string] ?? 
                         (header.column.getCanSort() ? <ArrowUpDown className="w-3 h-3 text-gray-300" /> : null)}
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
                                // For the body cell, we need to match the row's background. 
                                // Since we can't easily inherit 'hover', we set a solid base bg-white 
                                // and apply a specific hover state if needed, or accept it obscures the row hover.
                                // For simplicity and robustness: bg-white.
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
