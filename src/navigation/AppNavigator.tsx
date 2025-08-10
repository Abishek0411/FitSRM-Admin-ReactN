// /src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import UserListScreen from '../screens/UserListScreen';
import TransactionScreen from '../screens/TransactionScreen';
import QrGeneratorScreen from '../screens/QrGeneratorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="UserList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'Users' }}
      />
      <Stack.Screen
        name="Transactions"
        component={TransactionScreen}
      />
      <Stack.Screen
        name="QrGenerator"
        component={QrGeneratorScreen}
        options={{ title: 'Generate QR' }}
      />
    </Stack.Navigator>
  );
}