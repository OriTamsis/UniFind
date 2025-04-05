import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../config/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LogInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert('Error', 'No user found with this username.');
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;
  
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Welcome');
    } catch (error) {
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Error',
          'Insufficient permissions. Please check Firestore security rules.'
        );
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };
  

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.link}>
        Don't have an account?{' '}
        <Text onPress={() => navigation.navigate('Register')} style={styles.linkText}>Register</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#2D2D2D',
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    color: '#007BFF',
    textAlign: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});