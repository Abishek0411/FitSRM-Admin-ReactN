// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const API_BASE_URL = "https://1psc5nc9-8002.inc1.devtunnels.ms";

type User = {
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

type Transaction = {
  transaction_type: string;
  activity_type: string;
  amount: number;
  created_at: string;
};

export default function App() {
  const [screen, setScreen] = useState<"users" | "transactions" | "qr">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [qrData, setQrData] = useState<{ name: string; amount: string; imageUrl?: string }>({
    name: "",
    amount: "",
  });

  useEffect(() => {
    if (screen === "users") {
      fetchUsers();
    }
  }, [screen]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/get-users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const fetchTransactions = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-transaction?id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    fetchTransactions(userId);
    setScreen("transactions");
  };

  const handleGenerateQR = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: qrData.name,
          amount: parseFloat(qrData.amount),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate QR");
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrData({ ...qrData, imageUrl });
      Alert.alert("Success", "QR Code generated");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (screen === "users") {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>User List</Text>
        <TextInput
          style={styles.input}
          placeholder="Search username..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={item => item.user_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserSelect(item.user_id)}>
              <Text style={styles.item}>{item.username} - {item.email}</Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Generate QR" onPress={() => setScreen("qr")} />
      </View>
    );
  }

  if (screen === "transactions") {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Transactions for {selectedUserId}</Text>
        <FlatList
          data={transactions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.transaction_type} | {item.activity_type} | {item.amount} | {item.created_at}
            </Text>
          )}
        />
        <Button title="Back" onPress={() => setScreen("users")} />
      </View>
    );
  }

  if (screen === "qr") {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Generate QR</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={qrData.name}
          onChangeText={(val) => setQrData({ ...qrData, name: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={qrData.amount}
          onChangeText={(val) => setQrData({ ...qrData, amount: val })}
        />
        <Button title="Generate QR" onPress={handleGenerateQR} />
        {qrData.imageUrl && <Image source={{ uri: qrData.imageUrl }} style={{ width: 200, height: 200, marginTop: 20 }} />}
        <Button title="Back" onPress={() => setScreen("users")} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
});
