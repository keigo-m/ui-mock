export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  createdAt: string
}

export const payments: Payment[] = Array.from({ length: 100 }, (_, i) => ({
  id: `PAY-${i + 1}`,
  amount: (i * 10) % 500 + 50, // 50 to 540
  status: ["pending", "processing", "success", "failed"][i % 4] as Payment["status"],
  email: `user${i + 1}@example.com`,
  createdAt: new Date(2023, 0, 1 + i).toISOString(), // Fixed dates starting from Jan 1, 2023
}))
