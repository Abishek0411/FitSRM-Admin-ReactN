// /src/components/Card.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

const Card = ({ children, onPress, style }: CardProps) => {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;