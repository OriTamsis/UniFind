import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const BackButton = ({ onPress }) => (
    <TouchableOpacity 
        style={styles.backButton} 
        onPress={onPress}
        activeOpacity={0.7}
    >
        <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#007AFF" 
        />
        <Text style={styles.backButtonText}>
            Back to Lost Items
        </Text>
    </TouchableOpacity>
);