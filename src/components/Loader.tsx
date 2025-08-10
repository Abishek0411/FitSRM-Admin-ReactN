// /src/components/Loader.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const Loader = ({ visible }: { visible: boolean }) => (
  <Modal transparent={true} animationType="none" visible={visible}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;