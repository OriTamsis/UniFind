import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const DateInfo = ({ date }) => (
    <View style={styles.infoRow}>
        <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </Text>
    </View>
);