import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/chatList';

export const ChatItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
        <View style={styles.chatInfo}>
            <Text style={styles.userName}>
                {item.otherUserName}
            </Text>
            <Text style={styles.itemDetails}>
                {item.itemCategory} • {item.itemName}
            </Text>
            <Text style={styles.lastMessage}>
                {item.lastMessage || 'No messages yet'}
            </Text>
        </View>
        {item.lastMessageTime && (
            <Text style={styles.timeStamp}>
                {item.lastMessageTime.toLocaleTimeString()}
            </Text>
        )}
    </TouchableOpacity>
);