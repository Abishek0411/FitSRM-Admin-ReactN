// /src/screens/UserListScreen.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as RNFS from 'react-native-fs';
import Share from 'react-native-share';

// Local Imports
import { fetchUsers, fetchTransactions } from '../api/apiService';
import { generateExcel } from '../utils/excelGenerator'; // <-- Import our new utility
import { User } from '../types';
import { RootStackParamList } from '../navigation/types';
import Card from '../components/Card';
import Loader from '../components/Loader';

type UserListNavProp = StackNavigationProp<RootStackParamList, 'UserList'>;

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // <-- New state for Excel generation
  const navigation = useNavigation<UserListNavProp>();

  // --- NEW FUNCTION: Handle Excel Generation ---
  const handleGenerateExcel = async () => {
    setIsGenerating(true);
    try {
      // 1. Fetch all users and their transactions
      const allUsers = await fetchUsers();
      const transactionPromises = allUsers.map(u => fetchTransactions(u.user_id));
      const allTransactions = await Promise.all(transactionPromises);

      // 2. Generate the Excel file content (base64)
      const excelBase64 = generateExcel(allUsers, allTransactions);
      
      // 3. Save the file to the device's cache directory
      const path = `${RNFS.CachesDirectoryPath}/UserData.xlsx`;
      await RNFS.writeFile(path, excelBase64, 'base64');

      // 4. Open the share sheet
      await Share.open({
        title: 'Share User Data',
        url: `file://${path}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        failOnCancel: false,
      });

    } catch (err: any) {
      Alert.alert('Error', `Failed to generate Excel file: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity onPress={handleGenerateExcel} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Generate Excel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('QrGenerator')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Generate QR</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadUsers = async () => {
      // ... (existing code, no changes here)
      try {
        setIsLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <TextInput
        style={styles.input}
        placeholder="Search by username..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.user_id}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('Transactions', { user: item })}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </Card>
        )}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.emptyText}>No users found.</Text> : null
        }
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (keep existing styles)
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  input: {
    backgroundColor: 'white',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  username: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  
  // --- NEW STYLES for Header ---
  headerButtonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});