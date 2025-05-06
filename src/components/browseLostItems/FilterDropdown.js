import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/browseLostItems';

export const categories = ['All', 'Academic & Study Materials', 'Bags & Wearables', 'Electronics & Gadgets', 'Keys & Identification', 'Other'];

export const FilterDropdown = ({ selectedCategory, onCategorySelect }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    return (
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
                                onCategorySelect(category);
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
};