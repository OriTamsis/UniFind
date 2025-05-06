import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/welcome';

export const ChatButton = ({ onPress }) => (
    <TouchableOpacity 
        style={styles.chatButton}
        onPress={onPress}
    >
        <MaterialCommunityIcons 
            name="chat" 
            size={24} 
            color="#fff" 
        />
    </TouchableOpacity>
);