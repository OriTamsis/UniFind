import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        marginBottom: 20,
    },
    inputContainer: {
        flex: 1,
        marginRight: 20,
    },
    rightContainer: {
        flex: 1.2,
    },
    input: {
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
        color: '#fff',
        justifyContent: 'center',
        height: 45,
    },
    descriptionInput: {
        height: 45, 
        textAlignVertical: 'center', 
        paddingTop: 8, 
    },
    dateText: {
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        height: 45, 
    },
    switchLabel: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    imageSection: {
        width: '100%',
        height: 380, 
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', 
        aspectRatio: 3/4,
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
        marginTop: 8, 
        marginBottom: 8,
        height: 45, 
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 10,
        height: 45, 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8, 
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