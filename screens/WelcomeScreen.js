import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function WelcomeScreen({ navigation }) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().username); 
          } else {
            console.warn('No user data found in Firestore.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserName(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Logged out successfully!');
      navigation.navigate('Welcome'); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleReportItem = () => {
    navigation.navigate('ReportItem');
  };

  const handleBrowseItems = () => {
    navigation.navigate('BrowseLostItems');
  };

  const handleChatPress = () => {
    navigation.navigate('ChatList', { isListView: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {userName && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.greeting}>Hello, {userName}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="map-marker-radius" size={80} color="#fff" />
          <Text style={styles.title}>UniFind</Text>
          <Text style={styles.subtitle}>Reconnecting People with Their Belongings</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={handleReportItem}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Report Lost Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.browseButton]} onPress={handleBrowseItems}>
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
          <Text style={styles.buttonText}>Browse Lost Items</Text>
        </TouchableOpacity>
      </View>

      {!userName && (
        <View style={styles.authContent}>
          <Text style={styles.footerText}>Join our community of helpful people</Text>
          <View style={styles.authButtonContainer}>
            <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('LogIn')}>
              <Text style={styles.authButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.authButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={handleChatPress}
      >
        <MaterialCommunityIcons name="chat" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: '15%',
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  authContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  buttonContainer: {
    width: '88%',
    gap: 16,
    marginTop: 60,
    marginBottom: 40,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D2D2D',
  },
  reportButton: {
    backgroundColor: '#FF6B6B',
  },
  browseButton: {
    backgroundColor: '#45B7D1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  authButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '88%',
    alignSelf: 'center',
    gap: 16,
  },
  authButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }
});
