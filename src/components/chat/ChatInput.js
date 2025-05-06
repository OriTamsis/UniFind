import React from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/chat';

export const ChatInput = ({ isReporter, newMessage, setNewMessage, onSendMessage, onShareLocation }) => (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
        <View style={styles.inputContainer}>
            {isReporter && (
                <TouchableOpacity 
                    style={styles.locationButton}
                    onPress={onShareLocation}
                >
                    <MaterialCommunityIcons name="map-marker" size={24} color="#007AFF" />
                </TouchableOpacity>
            )}
            <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                multiline
                maxHeight={100}
            />
            <TouchableOpacity 
                style={styles.sendButton} 
                onPress={onSendMessage}
                disabled={!newMessage.trim()}
            >
                <MaterialCommunityIcons 
                    name="send" 
                    size={24} 
                    color={newMessage.trim() ? "#007AFF" : "#666"} 
                />
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
);