import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/chat';

export const ChatHeader = ({ 
    isReporter, 
    locationShared, 
    reporterName, 
    onMarkAsFound,
    onBack 
}) => (
    <View style={styles.header}>
        {isReporter && (
            <TouchableOpacity
                style={[styles.foundButton, !locationShared && styles.foundButtonDisabled]}
                onPress={locationShared ? onMarkAsFound : null}
                disabled={!locationShared}
            >
                <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={locationShared ? "#fff" : "rgba(255, 255, 255, 0.5)"}
                />
                <Text style={styles.foundButtonText}>Mark as Found</Text>
            </TouchableOpacity>
        )}
        <Text style={styles.headerName}>{reporterName || 'Chat'}</Text>
        <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
        >
            <MaterialCommunityIcons 
                name="chevron-left" 
                size={24} 
                color="#fff" 
            />
        </TouchableOpacity>
    </View>
);