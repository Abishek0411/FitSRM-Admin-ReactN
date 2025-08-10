// /src/screens/QrGeneratorScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { generateQrCode } from '../api/apiService';

export default function QrGeneratorScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQR = async () => {
    if (!name || !amount) {
      return Alert.alert('Validation Error', 'Please enter both name and amount.');
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return Alert.alert('Validation Error', 'Please enter a valid positive amount.');
    }

    try {
      setIsLoading(true);
      setImageUrl(null);
      const blob = await generateQrCode(name, numericAmount);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Generate Payment QR</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Recipient Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount (₹)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <Button
        title={isLoading ? 'Generating...' : 'Generate QR Code'}
        onPress={handleGenerateQR}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.qrPlaceholder} />}
      {imageUrl && (
        <View style={styles.qrContainer}>
          <Image source={{ uri: imageUrl }} style={styles.qrImage} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  qrPlaceholder: { marginTop: 40 },
  qrContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrImage: { width: 250, height: 250 },
});