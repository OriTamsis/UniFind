import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/chat';

export const Message = ({ message }) => (
    <View style={[
        styles.messageContainer,
        message.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
    ]}>
        <Text style={styles.messageText}>{message.text}</Text>
        {message.timestamp && (
            <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                })}
            </Text>
        )}
    </View>
);