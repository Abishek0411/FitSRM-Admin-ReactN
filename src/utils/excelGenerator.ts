// /src/utils/excelGenerator.ts
import * as XLSX from 'xlsx';
import { User, Transaction } from '../types';

// Step 1: Add all the new user fields to our Excel row type
type EnrichedTransaction = {
  UserID: string;
  Username: string;
  Email: string;
  PhoneNumber: string;
  DOB: string;
  Height: string;
  Weight: string;
  Gender: string;
  'Blood Group': string; // Keys with spaces become column headers
  'Credit Balance': number;
  'Transaction Date': string;
  'Transaction Type': 'earn' | 'spent';
  'Activity Type': string;
  Amount: number;
};

export const generateExcel = (
  users: User[],
  allTransactions: Transaction[][]
): string => {
  const flattenedData: EnrichedTransaction[] = [];
  users.forEach((user, index) => {
    const userTransactions = allTransactions[index];
    if (userTransactions && userTransactions.length > 0) {
      userTransactions.forEach(t => {
        // Step 2: Add the new user data to each transaction row
        flattenedData.push({
          // --- User Details ---
          UserID: user.user_id,
          Username: user.username,
          Email: user.email,
          PhoneNumber: user.phone_number,
          DOB: user.DOB,
          Height: user.height,
          Weight: user.weight,
          Gender: user.gender,
          'Blood Group': user.blood_group,
          'Credit Balance': user.credit_balance,
          // --- Transaction Details ---
          'Transaction Date': new Date(t.created_at).toLocaleString(),
          'Transaction Type': t.transaction_type,
          'Activity Type': t.activity_type,
          Amount: t.amount,
        });
      });
    } else {
      // Also add the details for users with no transactions
      flattenedData.push({
        UserID: user.user_id,
        Username: user.username,
        Email: user.email,
        PhoneNumber: user.phone_number,
        DOB: user.DOB,
        Height: user.height,
        Weight: user.weight,
        Gender: user.gender,
        'Blood Group': user.blood_group,
        'Credit Balance': user.credit_balance,
        'Transaction Date': 'N/A',
        'Transaction Type': 'earn', // Placeholder
        'Activity Type': 'No Transactions',
        Amount: 0,
      });
    }
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(flattenedData);
  XLSX.utils.book_append_sheet(wb, ws, 'UserData');
  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  return base64;
};