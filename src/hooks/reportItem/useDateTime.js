import { useState } from 'react';

export const useDateTime = () => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [useCurrentDate, setUseCurrentDate] = useState(true);
    const [useCurrentTime, setUseCurrentTime] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [modalVisible, setModalVisible] = useState({ map: false, calendar: false });

    const handleToggleDateSwitch = (value) => {
        setUseCurrentDate(value);
        if (value) {
            setSelectedDate(null);
            setDate(new Date());
        }
    };

    const handleToggleTimeSwitch = (value) => {
        setUseCurrentTime(value);
        if (value) {
            setSelectedTime(null);
            setTime(new Date());
        }
    };

    const handleShowTimePicker = () => {
        if (!useCurrentTime) {
            setShowTimePicker(true);
        }
    };

    const onChangeTime = (event, selected) => {
        setShowTimePicker(false);
        if (selected) {
            setSelectedTime(selected);
            setTime(selected);
            setUseCurrentTime(false);
        }
    };

    return {
        date,
        setDate,
        time,
        setTime,
        showTimePicker,
        setShowTimePicker,
        useCurrentDate,
        useCurrentTime,
        selectedDate,
        selectedTime,
        handleToggleDateSwitch,
        handleToggleTimeSwitch,
        handleShowTimePicker,
        onChangeTime,
        setSelectedDate,
        setSelectedTime,
        modalVisible,
        setModalVisible
    };
};