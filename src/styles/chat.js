import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        minHeight: 60,
        position: 'relative',
    },
    headerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
    },
    foundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 1,
    },
    foundButtonDisabled: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    foundButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    locationIndicator: {
        color: '#007AFF',
        fontSize: 14,
    },
    chatContainer: {
        flex: 1,
        position: 'relative',
        paddingBottom: 70, 
    },
    messageList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messagesList: {
        flex: 1,
    },
    messagesContentContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16, // Add padding at the bottom of the content
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#333',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    messageTime: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2D2D2D',
        borderTopWidth: 1,
        borderTopColor: '#3D3D3D',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 60,
        zIndex: 1,
    },
    locationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        width: 40, // Fixed width
        height: 40, // Fixed height
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 10,
        color: '#fff',
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        padding: 8,
        width: 40, // Fixed width
        height: 40, // Fixed height
        justifyContent: 'center',
        alignItems: 'center',
    },
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    systemMessageText: {
        color: '#666',
        fontSize: 14,
    },
    systemMessageTime: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    locationMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    locationText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    locationPreview: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        borderRadius: 8,
    },
    locationDetails: {
        color: '#fff',
        fontSize: 14,
    },
    tapToOpen: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        marginTop: 4,
    },
    backButton: {
        position: 'absolute',
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 8,
        zIndex: 1,
    },
});