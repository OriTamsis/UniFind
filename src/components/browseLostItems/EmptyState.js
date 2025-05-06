import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/browseLostItems';

export const EmptyState = ({ selectedCategory }) => (
    <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#666" />
        <Text style={styles.emptyText}>
            {selectedCategory === 'All' 
                ? 'No lost items reported yet'
                : `No ${selectedCategory} items found`}
        </Text>
    </View>
);