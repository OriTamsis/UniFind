import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/chat';

export const LoadingState = () => (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
);