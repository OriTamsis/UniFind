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
    listContainer: {
        padding: 16,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#2D2D2D',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
        padding: 12,
    },
    category: {
        color: '#007AFF',
        fontSize: 14,
        marginBottom: 4,
    },
    description: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    date: {
        color: '#999',
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 16,
    },
    filterContainer: {
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        zIndex: 1,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2D2D2D',
    },
    filterButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownItem: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#3D3D3D',
    },
    dropdownItemSelected: {
        backgroundColor: '#3D3D3D',
    },
    dropdownItemText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownItemTextSelected: {
        color: '#007AFF',
        fontWeight: 'bold',
    }
});