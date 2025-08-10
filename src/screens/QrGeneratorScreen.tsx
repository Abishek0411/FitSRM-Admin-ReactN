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
import * as RNFS from 'react-native-fs'; // Import react-native-fs
import Share from 'react-native-share'; // Import react-native-share
import { generateQrCode } from '../api/apiService';

export default function QrGeneratorScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null); // State to hold base64 data for sharing
  const [isLoading, setIsLoading] = useState(false);

  // Function to convert the image blob to base64
  const convertBlobToBase64 = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // The result includes a prefix like 'data:image/png;base64,'.
      // We need to remove it before saving with react-native-fs.
      const rawBase64 = base64Data.split(',')[1];
      setBase64Image(rawBase64);
    };
  };

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
      setBase64Image(null); // Reset previous image data

      const blob = await generateQrCode(name, numericAmount);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      
      // Convert the blob to base64 so we can save and share it
      convertBlobToBase64(blob);

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle sharing the QR code
  const handleShareQR = async () => {
    if (!base64Image) {
      Alert.alert('Error', 'No QR code available to share.');
      return;
    }
    try {
      const path = `${RNFS.CachesDirectoryPath}/qr_code.png`;
      await RNFS.writeFile(path, base64Image, 'base64');
      
      await Share.open({
        title: 'Share QR Code',
        url: `file://${path}`,
        type: 'image/png',
        failOnCancel: false,
      });

    } catch (error: any) {
      Alert.alert('Error', `Failed to share QR code: ${error.message}`);
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
          {/* Conditionally render the Share button only when an image is ready */}
          {base64Image && (
            <View style={styles.shareButton}>
              <Button title="Share QR" onPress={handleShareQR} />
            </View>
          )}
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
    alignItems: 'center', // Center the content
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrImage: { width: 250, height: 250 },
  shareButton: {
    marginTop: 15, // Add some space above the share button
    width: '60%',   // Make the button width smaller
  },
});