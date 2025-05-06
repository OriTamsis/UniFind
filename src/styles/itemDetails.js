import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    image: {
        width: '100%',
        height: 300,
    },
    noImageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    category: {
        color: '#007AFF',
        fontSize: 16,
        marginBottom: 8,
    },
    description: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingRight: 16, 
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
        flexShrink: 1, 
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 8,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#2D2D2D',
        padding: 12,
        borderRadius: 10,
    },
    reporterName: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    locationIconContainer: {
        position: 'relative',
        width: 20,
        height: 20,
        marginRight: 8,
    },
    lockIcon: {
        position: 'absolute',
        right: -4,
        bottom: -4,
    }
});