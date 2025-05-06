import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = () => {
    const [coordinates, setCoordinates] = useState(null);
    const [locationPermission, setLocationPermission] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 31.9704769,
        longitude: 34.8010227,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    
    const mapRef = useRef(null);

    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted' && useCurrentLocation) {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
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
                'Unable to get current location. Please select location manually.'
            );
        }
    };

    const handleLocationSwitch = async (value) => {
        setUseCurrentLocation(value);
        if (value) {
            if (!locationPermission) {
                const { status } = await Location.requestForegroundPermissionsAsync();
                setLocationPermission(status === 'granted');
                
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Required',
                        'Location permission is needed to use this feature.'
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

    const onLocationSelect = (event) => {
        const coords = event.nativeEvent.coordinate;
        setCoordinates(coords);
        setModalVisible(false);
    };

    const onModalClose = (value) => {
        setModalVisible(value);
    };

    return {
        coordinates,
        locationPermission,
        modalVisible,
        useCurrentLocation,
        initialRegion,
        mapRef,
        setModalVisible,
        handleLocationSwitch,
        onLocationSelect,
        onModalClose
    };
};