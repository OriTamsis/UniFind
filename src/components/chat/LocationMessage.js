import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { styles } from '../../styles/chat';

export const LocationMessage = ({ message }) => {
    const handleOpenLocation = async () => {
        try {
            // Fetch item location from the lost-items collection
            const itemDoc = await getDoc(doc(db, 'lost-items', message.itemId));
            if (!itemDoc.exists()) {
                throw new Error('Item not found');
            }

            const itemData = itemDoc.data();
            const { latitude, longitude } = itemData.location;

            if (!latitude || !longitude) {
                throw new Error('Location not available');
            }

            const url = Platform.select({
                ios: `maps:${latitude},${longitude}`,
                android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
            });

            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'Could not open location');
        }
    };

    return (
        <View style={[
            styles.messageContainer,
            message.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}>
            <TouchableOpacity 
                style={styles.locationMessage}
                onPress={handleOpenLocation}
            >
                <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
                <Text style={styles.locationText}>View Location 🗺️</Text>
            </TouchableOpacity>
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
};