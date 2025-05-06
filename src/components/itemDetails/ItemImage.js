import React from 'react';
import { View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/itemDetails';

export const ItemImage = ({ imageUrl }) => {
    if (!imageUrl) {
        return (
            <View style={styles.noImageContainer}>
                <MaterialCommunityIcons 
                    name="image-off" 
                    size={60} 
                    color="#666" 
                />
            </View>
        );
    }

    return (
        <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover"
        />
    );
};