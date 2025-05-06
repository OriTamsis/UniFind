// External Libraries
import React from 'react';
import { View, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

// Internal Components
import { FilterDropdown } from '../components/browseLostItems/FilterDropdown';
import { ItemCard } from '../components/browseLostItems/ItemCard';
import { EmptyState } from '../components/browseLostItems/EmptyState';

// Custom Hooks and Styles
import { useLostItems } from '../hooks/browseLostItems/useLostItems';
import { styles } from '../styles/browseLostItems';

/**
 * @fileoverview Browse Lost Items Screen Component - UniFind Application
 * @description Main screen for browsing and filtering lost items
 * @features
 * - Category filtering
 * - Pull to refresh
 * - Loading state handling
 * - Empty state handling
 * - Item card navigation
 * @returns {JSX.Element} List of lost items or appropriate state view
 */

export default function BrowseLostItems({ navigation }) {
    // Items data and handlers from custom hook
    const {
        items,
        loading,
        refreshing,
        selectedCategory,
        onRefresh,
        handleCategorySelect,
    } = useLostItems();

    // Loading state render
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Main component render
    return (
        <SafeAreaView style={styles.container}>
            {/* Category filter dropdown */}
            <FilterDropdown 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
            />
            
            {/* Items list with pull-to-refresh */}
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { item })} />
                )}
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
                    <EmptyState selectedCategory={selectedCategory} />
                }
            />
        </SafeAreaView>
    );
}