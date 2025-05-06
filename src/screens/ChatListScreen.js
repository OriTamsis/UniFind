// External Libraries
import React from 'react';
import { FlatList } from 'react-native';

// Internal Components
import { ChatItem } from '../components/chatList/ChatItem';
import { LoadingState } from '../components/chatList/LoadingState';
import { EmptyState } from '../components/chatList/EmptyState';

// Custom Hooks and Styles
import { useChats } from '../hooks/chatList/useChats';
import { styles } from '../styles/chatList';

/**
 * @fileoverview Chat List Screen Component - UniFind Application
 * @description Displays list of active chat conversations for the current user
 * @features
 * - Real-time chat list updates
 * - Loading state handling
 * - Empty state handling
 * - Navigation to individual chats
 * - Chat preview information
 * @returns {JSX.Element} List of chat conversations or appropriate state view
 */

export default function ChatsList({ navigation }) {
    // Chat list data and loading state from custom hook
    const { chats, loading } = useChats();

    // Loading state render
    if (loading) {
        return <LoadingState />;
    }

    // Empty state render
    if (chats.length === 0) {
        return <EmptyState />;
    }

    // Main list render with chat items
    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => (
                <ChatItem 
                    item={item}
                    onPress={() => navigation.navigate('Chats', {
                        isListView: false,
                        isNewChat: false,
                        chatId: item.id,
                        itemId: item.itemId,
                        reporterId: item.otherUserId,
                        reporterName: item.otherUserName,
                        itemName: item.itemName,
                        itemCategory: item.itemCategory
                    })}
                />
            )}
            keyExtractor={item => item.id}
            style={styles.container}
        />
    );
}