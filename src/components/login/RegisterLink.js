import React from 'react';
import { Text } from 'react-native';
import { styles } from '../../styles/login';

export const RegisterLink = ({ onPress }) => (
    <Text style={styles.link}>
        Don't have an account?{' '}
        <Text onPress={onPress} style={styles.linkText}>
            Register
        </Text>
    </Text>
);