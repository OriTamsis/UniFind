import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { chatService } from '../services/chatService';

export default function ItemDetails({ route, navigation }) {
    const { item } = route.params;
    const [reporterName, setReporterName] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchReporterName = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', item.userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Use displayName or name, fallback to username from email if needed
                    setReporterName(
                        userData.displayName || 
                        userData.name || 
                        item.userEmail?.split('@')[0] || 
                        'Unknown User'
                    );
                }
            } catch (error) {
                console.error('Error fetching reporter name:', error);
                // Fallback to username from email
                setReporterName(item.userEmail?.split('@')[0] || 'Unknown User');
            }
        };

        if (item.userId) {
            fetchReporterName();
        }
    }, [item.userId]);

    useEffect(() => {
        // Add auth listener
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);
    
    // Parse the date string when needed
    const createdDate = new Date(item.createdAt);

    // Replace handleContact function
    const handleContact = async () => {
        if (!currentUser) {
            Alert.alert('Login Required', 'Please login to chat with the item owner');
            navigation.navigate('LogIn');
            return;
        }

        if (currentUser.uid === item.userId) {
            Alert.alert('Error', 'You cannot chat with yourself');
            return;
        }

        try {
            // Get user data first
            const userDoc = await getDoc(doc(db, 'users', item.userId));
            const userData = userDoc.data();
            const reporterName = userData?.displayName || userData?.email?.split('@')[0] || 'User';

            // Navigate to chat with proper params
            navigation.navigate('Chats', {
                isListView: false,
                isNewChat: true,
                itemId: item.id,
                reporterId: item.userId,
                reporterName: reporterName,
                itemName: item.description,
                itemCategory: item.category
            });
        } catch (error) {
            console.error('Error navigating to chat:', error);
            Alert.alert('Error', 'Failed to open chat');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#007AFF" />
                <Text style={styles.backButtonText}>Back to Lost Items</Text>
            </TouchableOpacity>

            <ScrollView>
                {item.imageUrl ? (
                    <Image 
                        source={{ uri: item.imageUrl }} 
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <MaterialCommunityIcons name="image-off" size={60} color="#666" />
                    </View>
                )}
                
                <View style={styles.contentContainer}>
                    <View style={styles.reporterInfo}>
                        <MaterialCommunityIcons name="account" size={24} color="#007AFF" />
                        <Text style={styles.reporterName}>Reported by: {reporterName}</Text>
                    </View>

                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>
                            {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}
                        </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.locationIconContainer}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
                            <MaterialCommunityIcons 
                                name="lock" 
                                size={12} 
                                color="#007AFF" 
                                style={styles.lockIcon} 
                            />
                        </View>
                        <Text style={styles.infoText}>
                            Location hidden - Chat with reporter to verify and get location
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={handleContact}
                    >
                        <MaterialCommunityIcons name="chat" size={24} color="#fff" />
                        <Text style={styles.contactButtonText}>Chat with Reporter</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    image: {
        width: '100%',
        height: 300,
    },
    noImageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    category: {
        color: '#007AFF',
        fontSize: 16,
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingRight: 16, // Add padding to prevent text from touching screen edge
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
        flexShrink: 1, // Allow text to shrink if needed
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 8,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#2D2D2D',
        padding: 12,
        borderRadius: 10,
    },
    reporterName: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    locationIconContainer: {
        position: 'relative',
        width: 20,
        height: 20,
        marginRight: 8,
    },
    lockIcon: {
        position: 'absolute',
        right: -4,
        bottom: -4,
    }
});