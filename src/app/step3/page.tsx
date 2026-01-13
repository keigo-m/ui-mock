"use client"; // Client component needed for TanStack Table hooks

import { payments, Payment } from "@/data/mockData";
import Link from "next/link";
import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// --- Table Configuration ---

const columnHelper = createColumnHelper<Payment>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const styles = {
        success: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        failed: 'bg-red-100 text-red-700',
      };
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => <div className="text-right">${info.getValue().toFixed(2)}</div>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => <span className="text-gray-500">{new Date(info.getValue()).toLocaleDateString()}</span>,
  }),
];

// --- Page ---

export default function Step3Page() {
  // TanStack Table Hook
  const table = useReactTable({
    data: payments, // Data
    columns,        // Column definitions
    getCoreRowModel: getCoreRowModel(), // Basic processing
  });

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Step 3: TanStack Table Basic</h1>
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>

      <div className="p-4 bg-purple-100 border-l-4 border-purple-500 text-purple-700 mb-6">
        <p className="font-bold">Learning Point</p>
        <p>We are now using <strong>Headless UI</strong>. The logic (columns, data mapping) is separated from the view (rendering `table` tags). It looks the same, but it's now ready for superpowers.</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
