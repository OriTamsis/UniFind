import { useState } from 'react';
import { Alert } from 'react-native';
import { uploadImageAsync } from '../../utils/imageUpload';
import { validateForm } from '../../utils/formValidation';
import { addLostItem } from '../../utils/addLostItem';
import { auth } from '../../config/firebase';

export const useReportItem = (navigation) => {
    const [itemCategory, setItemCategory] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData) => {
        const validation = validateForm(formData);
        if (!validation.isValid) {
            Alert.alert('Error', validation.message);
            return;
        }

        setIsLoading(true);
        try {
            let imageUrl = null;
            if (formData.selectedImage) {
                imageUrl = await uploadImageAsync(formData.selectedImage);
            }

            const currentUser = auth.currentUser;
            const itemData = {
                category: formData.itemCategory,
                date: formData.useCurrentDate ? new Date() : formData.selectedDate,
                description: formData.itemDescription,
                imageUrl,
                location: formData.coordinates,
                time: formData.useCurrentTime ? new Date() : formData.selectedTime,
                userEmail: currentUser.email,
                userId: currentUser.uid
            };

            await addLostItem(itemData);
            
            Alert.alert(
                'Success',
                'Item reported successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('Welcome') }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to report item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        itemCategory,
        setItemCategory,
        itemDescription,
        setItemDescription,
        isLoading,
        handleSubmit,
    };
};