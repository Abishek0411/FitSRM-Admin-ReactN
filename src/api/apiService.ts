// /src/api/apiService.ts
import { User, Transaction } from "../types";

// The Dev Tunnel URL is for development
const DEVELOPMENT_URL = "https://1psc5nc9-8002.inc1.devtunnels.ms";

// The local IP is for the production environment
const PRODUCTION_URL = "http://172.16.0.60:8002";

// Use the __DEV__ variable to choose the URL automatically.
// In development mode, it uses the Dev Tunnel.
// In a production (release) build, it uses the local IP.
const API_BASE_URL = __DEV__ ? DEVELOPMENT_URL : PRODUCTION_URL;

console.log(`API running on: ${API_BASE_URL}`); // Helpful for debugging

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/get-users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
  const res = await fetch(`${API_BASE_URL}/get-transaction?id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

export const generateQrCode = async (name: string, amount: number): Promise<Blob> => {
  const res = await fetch(`${API_BASE_URL}/generate-qr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount }),
  });
  if (!res.ok) throw new Error("Failed to generate QR Code");
  return res.blob();
};