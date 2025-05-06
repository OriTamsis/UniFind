import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/welcome';

export const Header = ({ children }) => (
    <View style={styles.header}>
        {children}
        <View style={styles.logoContainer}>
            <MaterialCommunityIcons 
                name="map-marker-radius" 
                size={80} 
                color="#fff" 
            />
            <Text style={styles.title}>UniFind</Text>
            <Text style={styles.subtitle}>
                Reconnecting People with Their Belongings
            </Text>
        </View>
    </View>
);