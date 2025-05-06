import React from 'react';
import { FlatList } from 'react-native';
import { Message } from './Message';
import { LocationMessage } from './LocationMessage';
import { styles } from '../../styles/chat';
import { auth } from '../../config/firebase';

export const MessageList = ({ messages }) => {
    const renderMessage = ({ item }) => {
        const isCurrentUser = item.senderId === auth.currentUser?.uid;
        return item.type === 'location' 
            ? <LocationMessage message={{ ...item, isCurrentUser }} />
            : <Message message={{ ...item, isCurrentUser }} />;
    };

    return (
        <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            inverted
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContentContainer}
        />
    );
};