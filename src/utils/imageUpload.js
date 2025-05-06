import { CLOUDINARY_CONFIG } from '../config/cloudinary';
import { auth } from '../config/firebase';

export const uploadImageAsync = async (uri) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri,
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
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};