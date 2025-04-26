import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function BrowseLostItems({ navigation }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    const categories = ['All', 'Academic & Study Materials', 'Bags & Wearables', 'Electronics & Gadgets', 'Keys & Identification', 'Other'];

    const fetchLostItems = async () => {
        try {
            let q = query(
                collection(db, 'lost-items'),
                where('status', '==', 'lost'), // Only show active items
                orderBy('createdAt', 'desc')
            );
            
            setLoading(true);
            const querySnapshot = await getDocs(q);
            const itemsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate().toISOString(),
                };
            });

            // Filter items by category if a category is selected
            const filteredItems = selectedCategory === 'All' 
                ? itemsList 
                : itemsList.filter(item => item.category === selectedCategory);

            setItems(filteredItems);
        } catch (error) {
            console.error('Error fetching items:', error);
            // Show a more user-friendly message while index is being built
            if (error.code === 'failed-precondition') {
                Alert.alert(
                    'Setting up...',
                    'The app is configuring the database. This may take a few minutes.'
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLostItems();
    }, [selectedCategory]); // Re-fetch when category changes

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchLostItems();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemCard}
            onPress={() => navigation.navigate('ItemDetails', {
                // Create a serializable item object
                item: {
                    ...item,
                    // Ensure date is passed as string
                    createdAt: item.createdAt
                }
            })}
        >
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <Image 
                        source={{ uri: item.imageUrl }} 
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <MaterialCommunityIcons name="image-off" size={40} color="#666" />
                    </View>
                )}
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={styles.date}>
                    {/* Parse the ISO string for display */}
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const FilterDropdown = () => (
        <View style={styles.filterContainer}>
            <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setIsFilterVisible(!isFilterVisible)}
            >
                <MaterialIcons name="filter-list" size={24} color="#007AFF" />
                <Text style={styles.filterButtonText}>
                    {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                </Text>
                <MaterialIcons 
                    name={isFilterVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    size={24} 
                    color="#007AFF" 
                />
            </TouchableOpacity>

            {isFilterVisible && (
                <View style={styles.dropdownContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.dropdownItem,
                                selectedCategory === category && styles.dropdownItemSelected
                            ]}
                            onPress={() => {
                                setSelectedCategory(category);
                                setIsFilterVisible(false);
                            }}
                        >
                            <Text style={[
                                styles.dropdownItemText,
                                selectedCategory === category && styles.dropdownItemTextSelected
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FilterDropdown />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#666" />
                        <Text style={styles.emptyText}>
                            {selectedCategory === 'All' 
                                ? 'No lost items reported yet'
                                : `No ${selectedCategory} items found`}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    listContainer: {
        padding: 16,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
        padding: 12,
    },
    category: {
        color: '#007AFF',
        fontSize: 14,
        marginBottom: 4,
    },
    description: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    date: {
        color: '#999',
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 16,
    },
    filterContainer: {
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        zIndex: 1,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2D2D2D',
    },
    filterButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownItem: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#3D3D3D',
    },
    dropdownItemSelected: {
        backgroundColor: '#3D3D3D',
    },
    dropdownItemText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownItemTextSelected: {
        color: '#007AFF',
        fontWeight: 'bold',
    }
});