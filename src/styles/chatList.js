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
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    chatInfo: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDetails: {
        color: '#999',
        fontSize: 14,
        marginBottom: 4,
    },
    lastMessage: {
        color: '#999',
        fontSize: 14,
        marginTop: 4,
    },
    timeStamp: {
        color: '#666',
        fontSize: 12,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    noChatsText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 16,
        fontWeight: 'bold',
    },
    noChatsSubText: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    }
});