// /src/types/index.ts
export type User = {
  user_id: string;
  username: string;
  phone_number: string;
  email: string;
  DOB: string;
  height: string;
  weight: string;
  gender: string;
  blood_group: string;
  credit_balance: number;
};

export type Transaction = {
  transaction_type: "earn" | "spent";
  activity_type: string;
  amount: number;
  created_at: string;
};