// External Libraries
import React from 'react';
import { SafeAreaView, View } from 'react-native';

// Internal Components
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { LoadingState } from '../components/chat/LoadingState';

// Custom Hooks and Styles
import { useChat } from '../hooks/chat/useChat';
import { styles } from '../styles/chat';

/**
 * @fileoverview Chat Screen Component - UniFind Application
 * @description Real-time chat interface for communication between users
 * @features
 * - Real-time messaging
 * - Location sharing
 * - Mark item as found functionality
 * - Loading state handling
 * - Navigation controls
 * @returns {JSX.Element} Chat interface with messages and input
 */

export default function ChatScreen({ route, navigation }) {
    // Chat functionality from custom hook
    const {
        loading,
        messages,
        newMessage,
        setNewMessage,
        isReporter,
        locationShared,
        reporterName,
        handleSendMessage,
        handleShareLocation,
        handleMarkAsFound
    } = useChat(route, navigation);

    // Navigation handler for back button
    const handleBack = () => {
        navigation.goBack();
    };

    // Loading state render
    if (loading) return <LoadingState />;

    // Main component render
    return (
        <SafeAreaView style={styles.container}>
            {/* Chat header with controls */}
            <ChatHeader 
                isReporter={isReporter}
                locationShared={locationShared}
                reporterName={reporterName}
                onMarkAsFound={handleMarkAsFound}
                onBack={handleBack}
            />

            {/* Messages container */}
            <View style={styles.chatContainer}>
                <MessageList messages={messages} />
            </View>

            {/* Message input and actions */}
            <ChatInput 
                isReporter={isReporter}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                onShareLocation={handleShareLocation}
            />
        </SafeAreaView>
    );
}