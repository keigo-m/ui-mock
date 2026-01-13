import { payments } from "@/data/mockData";
import Link from "next/link";

export default function Step1Page() {
  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Step 1: Basic HTML Table</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
      
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-6">
        <p className="font-bold">Learning Point</p>
        <p>This method works for small data, but fails for large datasets. Scroll down to see 100 rows! No sorting, no filtering.</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{payment.id}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${payment.status === 'success' ? 'bg-green-100 text-green-700' : 
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      payment.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }
                  `}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">{payment.email}</td>
                <td className="px-4 py-3 text-right">${payment.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
