import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/welcome';

export const AuthSection = ({ navigation }) => (
    <View style={styles.authContent}>
        <Text style={styles.footerText}>
            Join our community of helpful people
        </Text>
        <View style={styles.authButtonContainer}>
            <TouchableOpacity 
                style={styles.authButton} 
                onPress={() => navigation.navigate('LogIn')}
            >
                <Text style={styles.authButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.authButton} 
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.authButtonText}>Register</Text>
            </TouchableOpacity>
        </View>
    </View>
);