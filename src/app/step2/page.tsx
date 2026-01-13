import { payments, Payment } from "@/data/mockData";
import Link from "next/link";
import React from 'react';

// --- Components ---
// In a real app, these would be in separate files (e.g., components/SimpleTable.tsx)

const StatusBadge = ({ status }: { status: Payment['status'] }) => {
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
};

const TableHeader = () => (
  <thead className="bg-gray-100 border-b">
    <tr>
      <th className="px-4 py-3 font-medium">ID</th>
      <th className="px-4 py-3 font-medium">Status</th>
      <th className="px-4 py-3 font-medium">Email</th>
      <th className="px-4 py-3 font-medium text-right">Amount</th>
      <th className="px-4 py-3 font-medium text-gray-500">Created At</th>
    </tr>
  </thead>
);

const TableRow = ({ payment }: { payment: Payment }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-4 py-3 font-medium">{payment.id}</td>
    <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
    <td className="px-4 py-3">{payment.email}</td>
    <td className="px-4 py-3 text-right">${payment.amount.toFixed(2)}</td>
    <td className="px-4 py-3 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
  </tr>
);

// --- Page ---

export default function Step2Page() {
  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Step 2: React Components</h1>
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>

      <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 mb-6">
        <p className="font-bold">Learning Point</p>
        <p>We separated the UI into components (`TableRow`, `StatusBadge`). Code is cleaner, but we still lack complex features like sorting.</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <TableHeader />
          <tbody className="divide-y">
            {payments.map((payment) => (
              <TableRow key={payment.id} payment={payment} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
