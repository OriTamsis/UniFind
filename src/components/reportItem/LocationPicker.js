import React from 'react';
import { View, Text, TouchableOpacity, Switch, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/reportItem';

export const LocationPicker = ({ location }) => {
    const {
        coordinates,
        locationPermission,
        modalVisible,
        useCurrentLocation,
        initialRegion,
        mapRef,
        handleLocationSwitch,
        onLocationSelect,
        onModalClose
    } = location;

    return (
        <>
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
                onPress={() => !useCurrentLocation && onModalClose(true)}
            >
                <Text style={[styles.dateText, useCurrentLocation && styles.disabledText]}>
                    {coordinates ? `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}` : 'Select Location'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => onModalClose(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', padding: 10 }}
                            onPress={() => onModalClose(false)}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>

                        <MapView
                            ref={mapRef}
                            style={{ width: 300, height: 300 }}
                            initialRegion={initialRegion}
                            onPress={onLocationSelect}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            loadingEnabled={true}
                            scrollEnabled={true}
                            zoomEnabled={false}
                            rotateEnabled={false}                                  
                            zoomTapEnabled={false}
                            zoomControlEnabled={true}
                        >
                            {coordinates && (
                                <Marker 
                                    identifier="marker" 
                                    coordinate={coordinates}
                                    draggable={true}
                                    onDragEnd={(e) => onLocationSelect(e)}
                                />
                            )}
                        </MapView>
                    </View>
                </View>
            </Modal>
        </>
    );
};