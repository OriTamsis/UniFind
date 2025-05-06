// External Libraries
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

// Internal Components
import { BackButton } from '../components/itemDetails/BackButton';
import { ItemImage } from '../components/itemDetails/ItemImage';
import { ItemContent } from '../components/itemDetails/ItemContent';

// Custom Hooks and Styles
import { useItemDetails } from '../hooks/itemDetails/useItemDetails';
import { styles } from '../styles/itemDetails';

/**
 * @fileoverview Item Details Screen Component - UniFind Application
 * @description Detailed view screen for a specific lost item
 * @features
 * - Item image display
 * - Item information presentation
 * - Reporter contact functionality
 * - Navigation handling
 * - Date formatting
 * @returns {JSX.Element} Detailed item view with image and information
 */

export default function ItemDetails({ route, navigation }) {
    // Get item data from navigation params
    const { item } = route.params;

    // Custom hook for item details functionality
    const { 
        reporterName, 
        handleContact,
        createdDate 
    } = useItemDetails(item, navigation);

    // Main component render
    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation back button */}
            <BackButton onPress={() => navigation.goBack()} />
            <ScrollView>
                {/* Item image display */}
                <ItemImage imageUrl={item.imageUrl} />
                
                {/* Item details and contact section */}
                <ItemContent 
                    item={item}
                    reporterName={reporterName}
                    createdDate={createdDate}
                    onContact={handleContact}
                />
            </ScrollView>
        </SafeAreaView>
    );
}