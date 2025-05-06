import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const checkPermissions = async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        
        if (!galleryStatus.granted || !cameraStatus.granted) {
            Alert.alert(
                'Permission Required',
                'Camera and gallery permissions are needed to use this feature.'
            );
            return false;
        }
        return true;
    };

    const handleCameraCapture = async () => {
        if (!(await checkPermissions())) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
                aspect: [3, 4],
                height: 1200,
                width: 900,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to capture photo');
        }
    };

    const handleGalleryPick = async () => {
        if (!(await checkPermissions())) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
                aspect: [3, 4],
                height: 1200,
                width: 900,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image from gallery');
        }
    };

    const handleImagePick = () => {
        Alert.alert(
            'Select Image',
            'Choose an option to add a photo',
            [
                {
                    text: 'Take Photo',
                    onPress: handleCameraCapture
                },
                {
                    text: 'Choose from Gallery',
                    onPress: handleGalleryPick
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    return {
        selectedImage,
        setSelectedImage,
        handleCameraCapture,
        handleGalleryPick,
        handleImagePick,
        handleRemoveImage: () => setSelectedImage(null)
    };
};