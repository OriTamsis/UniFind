import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/chatList';

export const LoadingState = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
);