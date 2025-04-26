import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    View,
    Image,
    Alert,
    Switch,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore'; 
import { db, auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

function ReportItem() {
    const navigation = useNavigation();

    useEffect(() => {
        if (!auth.currentUser) {
            Alert.alert(
                'Authentication Required',
                'Please log in to report a lost item.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.replace('LogIn')
                    }
                ]
            );
            return;
        }
    }, []);

    const [selectedImage, setSelectedImage] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [useCurrentDate, setUseCurrentDate] = useState(true);
    const [useCurrentTime, setUseCurrentTime] = useState(true);
    const [modalVisible, setModalVisible] = useState({ map: false, calendar: false });
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [locationPermission, setLocationPermission] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 31.9704769,
        longitude: 34.8010227,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [itemCategory, setItemCategory] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
            
            if (status === 'granted' && useCurrentLocation) {
                getCurrentLocation();
            }
        })();
    }, []);

    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced, // Changed from High to Balanced
                maxAge: 10000, // Use cached location if available within last 10 seconds
                timeout: 5000 // Timeout after 5 seconds
            });
            
            const newCoordinates = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };
            
            setCoordinates(newCoordinates);
            setInitialRegion({
                ...newCoordinates,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            Alert.alert(
                'Location Error',
                'Unable to get precise location. You can select location manually on the map.'
            );
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handleLocationSwitch = async (value) => {
        setUseCurrentLocation(value);
        
        if (value) {
            if (!locationPermission) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                setLocationPermission(status === 'granted');
                
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Required',
                        'Please enable location permissions to use current location.'
                    );
                    setUseCurrentLocation(false);
                    return;
                }
            }
            getCurrentLocation();
        } else {
            setCoordinates(null);
        }
    };

    const handleToggleDateSwitch = (value) => {
        setUseCurrentDate(value);
        if (value) {
            setSelectedDate('')
            setDate(new Date()); 
        }
    };
    
    const handleToggleTimeSwitch = (value) => {
        setUseCurrentTime(value);
        if (value) {
            setSelectedTime('')
            setTime(new Date());
        }
    };

    const checkPermissions = async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        
        if (!galleryStatus.granted || !cameraStatus.granted) {
            Alert.alert(
                'Permission required',
                'You need to grant camera and gallery permissions to use this feature.'
            );
            return false;
        }
        return true;
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

    const handleCameraCapture = async () => {
        if (!(await checkPermissions())) return;
    
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
                aspect: [3, 4], // Changed aspect ratio to match container
                height: 400   // Match container height
            });
    
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };
    
    const handleGalleryPick = async () => {
        if (!(await checkPermissions())) return;
    
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
                aspect: [3, 4], // Changed aspect ratio to match container
                height: 400   // Match container height
            });
    
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image from gallery');
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    const onChangeTime = (_, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setSelectedTime(selectedTime);
            setUseCurrentTime(false);
        }
    };

    const validateForm = () => {
        if (!itemCategory) {
            Alert.alert('Error', 'Please select a category');
            return false;
        }
        if (!itemDescription.trim()) {
            Alert.alert('Error', 'Please enter item description');
            return false;
        }
        if (!coordinates && !useCurrentLocation) {
            Alert.alert('Error', 'Please select a location');
            return false;
        }
        if (!selectedDate && !useCurrentDate) {
            Alert.alert('Error', 'Please select a date');
            return false;
        }
        if (!selectedTime && !useCurrentTime) {
            Alert.alert('Error', 'Please select a time');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setIsUploading(true);

            const submitWithData = async (imgUrl = null) => {
                const itemData = {
                    category: itemCategory,
                    description: itemDescription,
                    location: coordinates || initialRegion,
                    date: useCurrentDate ? new Date() : new Date(selectedDate),
                    time: useCurrentTime ? new Date() : new Date(selectedTime),
                    imageUrl: imgUrl,
                    createdAt: new Date(),
                    status: 'lost',
                    userId: auth.currentUser.uid,
                    userEmail: auth.currentUser.email
                };

                await addDoc(collection(db, 'lost-items'), itemData);
                Alert.alert('Success', 'Item reported successfully!',
                    [{ text: 'OK', onPress: () => navigation.navigate('Welcome') }]
                );
            };

            // Update the image handling section in handleSubmit
            if (selectedImage) {
                try {
                    setIsUploading(true);

                    const formData = new FormData();
                    formData.append('file', {
                        uri: selectedImage,
                        type: 'image/jpeg',
                        name: `${auth.currentUser.uid}_${Date.now()}.jpg`
                    });
                    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
                        {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data'
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    const data = await response.json();
                    await submitWithData(data.secure_url);

                } catch (error) {
                    console.error('Upload error:', error);
                    Alert.alert(
                        'Image Upload Failed',
                        'Would you like to continue without an image?',
                        [
                            { text: 'Cancel', style: 'cancel', onPress: () => setIsUploading(false) },
                            { text: 'Continue', onPress: () => submitWithData(null) }
                        ]
                    );
                }
            } else {
                await submitWithData(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to report item. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.subtitle}>Please fill in the details of the item you lost.</Text>
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <View style={[styles.input, { padding: 0 }]}>
                            <Picker
                                selectedValue={itemCategory}
                                onValueChange={(itemValue) => setItemCategory(itemValue)}
                                style={{ color: '#fff' }}
                                dropdownIconColor="#fff"
                            >
                                <Picker.Item label="Select Category" value="" enabled={false} />
                                <Picker.Item label="Academic & Study Materials" value="Academic & Study Materials" />
                                <Picker.Item label="Bags & Wearables" value="Bags & Wearables" />
                                <Picker.Item label="Electronics & Gadgets" value="Electronics & Gadgets" />
                                <Picker.Item label="Keys & Identification" value="Keys & Identification" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Item Description" 
                            placeholderTextColor="#fff"
                            value={itemDescription}
                            onChangeText={setItemDescription}
                            multiline
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                        />

                        {/* Location Section */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Use Current Location</Text>
                            <Switch
                                value={useCurrentLocation}
                                onValueChange={handleLocationSwitch}
                                trackColor={{ false: '#767577', true: '#007AFF' }}
                                thumbColor={useCurrentLocation ? '#fff' : '#f4f3f4'}
                                disabled={!locationPermission}
                            />
                        </View>
                        <TouchableOpacity 
                            style={[styles.input, useCurrentLocation && styles.disabledInput]}
                            onPress={() => !useCurrentLocation && setModalVisible(prevState => ({...prevState, map: true}))}
                        >
                            <Text style={[styles.dateText, useCurrentLocation && styles.disabledText]}>
                                {coordinates ? `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}` : 'Select Location'}
                            </Text>
                        </TouchableOpacity>

                        {/* Map Modal */}
                        <Modal
                            visible={modalVisible.map}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setModalVisible(prevState => ({...prevState, map: false}))}
                        >
                            <View style={styles.modalBackground}>
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity
                                        style={{ alignSelf: 'flex-end', padding: 10 }}
                                        onPress={() => setModalVisible(prevState => ({...prevState, map: false}))}
                                    >
                                        <Ionicons name="close" size={24} color="#fff" />
                                    </TouchableOpacity>

                                    <MapView
                                        ref={mapRef}
                                        style={{ width: 300, height: 300 }}
                                        initialRegion={initialRegion}
                                        onPress={(e) => {
                                            const newCoords = e.nativeEvent.coordinate;
                                            setCoordinates(newCoords);
                                            setUseCurrentLocation(false);
                                            setModalVisible(prevState => ({...prevState, map: false}));
                                        }}
                                        showsUserLocation={true}
                                        showsMyLocationButton={true}
                                        loadingEnabled={true}
                                        scrollEnabled={true}
                                        zoomEnabled={false}
                                        rotateEnabled={false}                                  
                                        zoomTapEnabled={false}
                                        zoomControlEnabled={true}
                                    >
                                        {coordinates && <Marker 
                                            identifier="marker" 
                                            coordinate={coordinates}
                                            draggable={true}
                                            onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}
                                        />}
                                    </MapView>
                                </View>
                            </View>
                        </Modal>

                        {/* Date Section */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Use Current Date</Text>
                            <Switch
                                value={useCurrentDate}
                                onValueChange={handleToggleDateSwitch}
                                trackColor={{ false: '#767577', true: '#007AFF' }}
                                thumbColor={useCurrentDate ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => !useCurrentDate && setModalVisible(prevState => ({...prevState, calendar: true}))}
                            style={[
                                styles.input,
                                useCurrentDate && styles.disabledInput,
                            ]}
                        >
                            <Text style={[styles.dateText, useCurrentDate && styles.disabledText]}>
                                {useCurrentDate
                                    ? date.toLocaleDateString()
                                    : selectedDate
                                    ? new Date(selectedDate).toLocaleDateString()
                                    : 'Select Date'}
                            </Text>
                        </TouchableOpacity>

                        {/* Time Section */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Use Current Time</Text>
                            <Switch
                                value={useCurrentTime}
                                onValueChange={handleToggleTimeSwitch}
                                trackColor={{ false: '#767577', true: '#007AFF' }}
                                thumbColor={useCurrentTime ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => !useCurrentTime && setShowTimePicker(true)}
                            style={[
                                styles.input,
                                useCurrentTime && styles.disabledInput,
                            ]}
                        >
                            <Text style={[styles.dateText, useCurrentTime && styles.disabledText]}>
                                {useCurrentTime
                                    ? time.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })
                                    : selectedTime ? new Date(selectedTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })
                                    : 'Select Time'}
                            </Text>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="default"
                                onChange={onChangeTime}
                            />
                        )}
                    </View>
                    
                    {/* Image Section */}
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
                </View>

                {/* Modal for Calendar */}
                <Modal
                    visible={modalVisible.calendar}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(prevState => ({...prevState, calendar: false}))}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', padding: 10 }}
                                onPress={() => setModalVisible(prevState => ({...prevState, calendar: false}))}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Calendar
                                onDayPress={(day) => {
                                    setSelectedDate(day.dateString);
                                    setDate(new Date(day.dateString));
                                    setModalVisible(prevState => ({...prevState, calendar: false}));
                                }}
                                markedDates={{
                                    [selectedDate]: { selected: true, selectedColor: 'blue' },
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Report Item</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flex: 1,
        marginRight: 20,
    },
    input: {
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        color: '#fff',
        justifyContent: 'center',
        height: 50, // Add specific height for picker
    },
    dateText: {
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    imageSection: {
        flex: 1,
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 400,
        borderRadius: 10,
        overflow: 'hidden', 
        marginBottom: 10,
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Changed from 'contain' to 'cover'
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#555',
        borderStyle: 'dashed'  
    },
    imagePickerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#fff',
        marginTop: 5,
        fontSize: 14,
        opacity: 0.8
    },
    removeButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledInput: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#999',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        padding: 20,
    },
    cameraIcon: {
        marginBottom: 8,
        opacity: 0.8
    }
});

export default ReportItem;