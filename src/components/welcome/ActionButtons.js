import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/welcome';

export const ActionButtons = ({ onReportItem, onBrowseItems }) => (
    <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.button, styles.reportButton]} 
            onPress={onReportItem}
        >
            <MaterialCommunityIcons 
                name="alert-circle-outline" 
                size={24} 
                color="#fff" 
            />
            <Text style={styles.buttonText}>Report Lost Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.button, styles.browseButton]} 
            onPress={onBrowseItems}
        >
            <MaterialCommunityIcons 
                name="magnify" 
                size={24} 
                color="#fff" 
            />
            <Text style={styles.buttonText}>Browse Lost Items</Text>
        </TouchableOpacity>
    </View>
);