import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const ReporterInfo = ({ reporterName }) => (
    <View style={styles.reporterInfo}>
        <MaterialCommunityIcons 
            name="account" 
            size={24} 
            color="#007AFF" 
        />
        <Text style={styles.reporterName}>
            Reported by {reporterName}
        </Text>
    </View>
);