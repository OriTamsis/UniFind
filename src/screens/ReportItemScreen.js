// External Libraries
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Internal Components
import { CategoryPicker } from '../components/reportItem/CategoryPicker';
import { LocationPicker } from '../components/reportItem/LocationPicker';
import { DateAndTimePicker } from '../components/reportItem/DateAndTimePicker';
import { ImageSection } from '../components/reportItem/ImageSection';

// Custom Hooks
import { useImagePicker } from '../hooks/reportItem/useImagePicker';
import { useLocation } from '../hooks/reportItem/useLocation';
import { useDateTime } from '../hooks/reportItem/useDateTime';
import { useReportItem } from '../hooks/reportItem/useReportItem';

// Configuration and Styles
import { auth } from '../config/firebase';
import { styles } from '../styles/reportItem';

/**
 * @fileoverview Report Item Screen Component - UniFind Application
 * @description Screen for reporting lost items with comprehensive form inputs
 * @features
 * - Category selection
 * - Location picking
 * - Date and time selection
 * - Image upload
 * - Authentication check
 * @returns {JSX.Element} Report item form with multiple input sections
 */

const ReportItemScreen = () => {
    // Navigation and custom hooks initialization
    const navigation = useNavigation();
    const imagePicker = useImagePicker();
    const location = useLocation();
    const dateTime = useDateTime();
    const { 
        itemCategory,
        setItemCategory,
        itemDescription,
        setItemDescription,
        isLoading,
        handleSubmit 
    } = useReportItem(navigation); // Form submission logic

    // Authentication check effect    
    useEffect(() => {
        if (!auth.currentUser) {
            Alert.alert(
                'Authentication Required',
                'Please log in to report a lost item.',
                [{ text: 'OK', onPress: () => navigation.replace('LogIn') }]
            );
        }
    }, []);

    // Main render with form sections    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.subtitle}>Please fill in the details of the item you lost.</Text>

                    {/* Main form container */}
                    <View style={styles.rowContainer}>
                        {/* Left side - Main form inputs */}
                        <View style={styles.inputContainer}>
                            <CategoryPicker 
                                itemCategory={itemCategory}
                                setItemCategory={setItemCategory}
                            />
                            {/* Description input */}
                            <TextInput 
                                style={[styles.input, styles.descriptionInput]} 
                                placeholder="Item Description" 
                                placeholderTextColor="#fff"
                                value={itemDescription}
                                onChangeText={setItemDescription}
                                multiline
                                numberOfLines={3}
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            <LocationPicker location={location} />
                            <DateAndTimePicker dateTime={dateTime} />
                        </View>

                        {/* Right side - Image section */}
                        <View style={styles.rightContainer}>
                            <View style={styles.imageSection}>
                                <ImageSection imagePicker={imagePicker} />
                            </View>
                            <View style={styles.imageButtonSpace} />
                        </View>
                    </View>

                    {/* Submit button */}
                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={() => handleSubmit({
                            itemCategory,
                            itemDescription,
                            coordinates: location.coordinates,
                            selectedImage: imagePicker.selectedImage,
                            selectedDate: dateTime.selectedDate,
                            selectedTime: dateTime.selectedTime,
                            useCurrentLocation: location.useCurrentLocation,
                            useCurrentDate: dateTime.useCurrentDate,
                            useCurrentTime: dateTime.useCurrentTime
                        })}
                        disabled={isLoading}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Uploading...' : 'Report Item'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default ReportItemScreen;