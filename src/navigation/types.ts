// /src/navigation/types.ts
import { User } from '../types';

export type RootStackParamList = {
  UserList: undefined;
  Transactions: { user: User };
  QrGenerator: undefined;
};