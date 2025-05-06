import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const useLostItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const fetchLostItems = async () => {
        try {
            let q = query(
                collection(db, 'lost-items'),
                where('status', '==', 'lost'),
                orderBy('createdAt', 'desc')
            );
            
            setLoading(true);
            const querySnapshot = await getDocs(q);
            const itemsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toISOString(),
            }));

            const filteredItems = selectedCategory === 'All' 
                ? itemsList 
                : itemsList.filter(item => item.category === selectedCategory);

            setItems(filteredItems);
        } catch (error) {
            console.error('Error fetching items:', error);
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
    }, [selectedCategory]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLostItems();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    return {
        items,
        loading,
        refreshing,
        selectedCategory,
        onRefresh,
        handleCategorySelect,
    };
};