import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const LocationInfo = () => (
    <View style={styles.infoRow}>
        <View style={styles.locationIconContainer}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
            <MaterialCommunityIcons 
                name="lock" 
                size={12} 
                color="#007AFF" 
                style={styles.lockIcon} 
            />
        </View>
        <Text style={styles.infoText}>
            Location hidden - Chat with reporter to verify and get location
        </Text>
    </View>
);