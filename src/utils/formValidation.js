export const validateForm = (formData) => {
    if (!formData.itemCategory || formData.itemCategory.trim() === '') {
        return { isValid: false, message: 'Please select a category' };
    }
    if (!formData.itemDescription?.trim()) {
        return { isValid: false, message: 'Please enter item description' };
    }
    if (!formData.coordinates && !formData.useCurrentLocation) {
        return { isValid: false, message: 'Please select a location' };
    }
    if (!formData.selectedDate && !formData.useCurrentDate) {
        return { isValid: false, message: 'Please select a date' };
    }
    if (!formData.selectedTime && !formData.useCurrentTime) {
        return { isValid: false, message: 'Please select a time' };
    }
    return { isValid: true };
};