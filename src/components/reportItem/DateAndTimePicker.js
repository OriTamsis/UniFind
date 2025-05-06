import React from 'react';
import { View, Text, TouchableOpacity, Switch, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/reportItem';

export const DateAndTimePicker = ({ dateTime }) => {
    const {
        date,
        time,
        showTimePicker,
        modalVisible,
        useCurrentDate,
        useCurrentTime,
        selectedDate,
        selectedTime,
        handleToggleDateSwitch,
        handleToggleTimeSwitch,
        onChangeTime,
        setModalVisible,
        setSelectedDate,
        setDate,
        handleShowTimePicker
    } = dateTime;

    const formatTime = (timeValue) => {
        if (!timeValue) return '';
        const date = new Date(timeValue);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <>
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
                onPress={() => !useCurrentDate && setModalVisible(prev => ({...prev, calendar: true}))}
                style={[styles.input, useCurrentDate && styles.disabledInput]}
            >
                <Text style={[styles.dateText, useCurrentDate && styles.disabledText]}>
                    {useCurrentDate
                        ? date.toLocaleDateString()
                        : selectedDate
                        ? new Date(selectedDate).toLocaleDateString()
                        : 'Select Date'}
                </Text>
            </TouchableOpacity>

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
                onPress={handleShowTimePicker}
                style={[styles.input, useCurrentTime && styles.disabledInput]}
            >
                <Text style={[styles.dateText, useCurrentTime && styles.disabledText]}>
                    {useCurrentTime
                        ? formatTime(time)
                        : selectedTime 
                        ? formatTime(selectedTime)
                        : 'Select Time'}
                </Text>
            </TouchableOpacity>

            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeTime}
                />
            )}

            <Modal
                visible={modalVisible.calendar}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(prev => ({...prev, calendar: false}))}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', padding: 10 }}
                            onPress={() => setModalVisible(prev => ({...prev, calendar: false}))}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Calendar
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                setDate(new Date(day.dateString));
                                setModalVisible(prev => ({...prev, calendar: false}));
                            }}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: 'blue' },
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};