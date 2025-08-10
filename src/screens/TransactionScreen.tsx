// /src/screens/TransactionScreen.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchTransactions } from '../api/apiService';
import { Transaction } from '../types';
import { RootStackParamList } from '../navigation/types';
import Loader from '../components/Loader';
import TransactionItem from '../components/TransactionItem';

type TransactionRouteProp = RouteProp<RootStackParamList, 'Transactions'>;

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute<TransactionRouteProp>();
  const navigation = useNavigation();
  const { user } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${user.username}'s Transactions` });
  }, [navigation, user]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions(user.user_id);
        setTransactions(data);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTransactions();
  }, [user.user_id]);

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <FlatList
        data={transactions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { fontSize: 16, color: '#888' },
});