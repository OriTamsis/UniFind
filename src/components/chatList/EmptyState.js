import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/chatList';

export const EmptyState = () => (
    <View style={styles.noChatsContainer}>
        <MaterialCommunityIcons 
            name="chat-outline" 
            size={64} 
            color="#666"
        />
        <Text style={styles.noChatsText}>No active chats</Text>
        <Text style={styles.noChatsSubText}>
            Start a conversation by viewing an item
        </Text>
    </View>
);