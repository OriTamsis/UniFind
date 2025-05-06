import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const ContactButton = ({ onPress }) => (
    <TouchableOpacity 
        style={styles.contactButton} 
        onPress={onPress}
        activeOpacity={0.7}
    >
        <MaterialCommunityIcons 
            name="chat" 
            size={24} 
            color="#fff" 
        />
        <Text style={styles.contactButtonText}>
            Contact Reporter
        </Text>
    </TouchableOpacity>
);