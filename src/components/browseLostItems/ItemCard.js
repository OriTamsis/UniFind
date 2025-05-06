import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/browseLostItems';

export const ItemCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.itemCard} onPress={onPress}>
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
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
            </View>
        </TouchableOpacity>
    );
};