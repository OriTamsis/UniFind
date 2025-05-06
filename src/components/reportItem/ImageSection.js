import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/reportItem';

export const ImageSection = ({ imagePicker }) => {
    const {
        selectedImage,
        handleImagePick,
        handleRemoveImage
    } = imagePicker;

    return (
        <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.imagePreview}
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.imagePlaceholder}
                        onPress={handleImagePick}
                    >
                        <View style={styles.imagePickerContent}>
                            <Ionicons
                                name="camera-outline"
                                size={40}
                                color="#fff"
                                style={styles.cameraIcon}
                            />
                            <Text style={styles.placeholderText}>Tap to Take Photo or</Text>
                            <Text style={styles.placeholderText}>Choose from Gallery</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            {selectedImage && (
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveImage}
                >
                    <Text style={styles.buttonText}>Remove Image</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};