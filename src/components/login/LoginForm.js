import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/login';

export const LoginForm = ({ 
    username, 
    password, 
    setUsername, 
    setPassword, 
    onSubmit 
}) => (
    <>
        <Text style={styles.title}>Log In</Text>
        <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
    </>
);