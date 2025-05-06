import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/welcome';

export const UserInfo = ({ userName, onLogout }) => (
    <View style={styles.userInfoContainer}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
        <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={onLogout}
        >
            <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
    </View>
);