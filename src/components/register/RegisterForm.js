import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/register';

export const RegisterForm = ({
    username,
    email,
    password,
    confirmPassword,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    onSubmit
}) => (
    <>
        <Text style={styles.title}>Register</Text>
        <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
        />
        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </>
);