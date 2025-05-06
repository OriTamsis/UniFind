import React from 'react';
import { Text } from 'react-native';
import { styles } from '../../styles/register';

export const LoginLink = ({ onPress }) => (
    <Text style={styles.link}>
        Already have an account?{' '}
        <Text onPress={onPress} style={styles.linkText}>
            Log In
        </Text>
    </Text>
);