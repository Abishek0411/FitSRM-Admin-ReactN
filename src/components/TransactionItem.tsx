// /src/components/TransactionItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types';

// Helper to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const TransactionItem = ({ item }: { item: Transaction }) => {
  const isCredit = item.transaction_type === 'earn';
  const amountColor = isCredit ? '#28a745' : '#dc3545';
  const amountSign = isCredit ? '+' : '-';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.activityType}>{item.activity_type}</Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountSign} ₹{item.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  left: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionItem;