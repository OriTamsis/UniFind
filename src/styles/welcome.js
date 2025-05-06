import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1E1E1E',
    },
    header: {
      alignItems: 'center',
      marginTop: 60,
      paddingBottom: 20,
    },
    logoContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 20,
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    },
    subtitle: {
      fontSize: 18,
      color: '#fff',
      marginTop: 10,
      textAlign: 'center',
      paddingHorizontal: 20,
      opacity: 0.9,
    },
    userInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: '15%',
    },
    greeting: {
      fontSize: 18,
      color: '#fff',
    },
    logoutButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#FF6B6B',
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -60,
    },
    authContent: {
      alignItems: 'center',
      marginTop: 40,
    },
    buttonContainer: {
      width: '88%',
      gap: 16,
      marginTop: 60,
      marginBottom: 40,
      alignSelf: 'center',
    },
    button: {
      flexDirection: 'row',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2D2D2D',
    },
    reportButton: {
      backgroundColor: '#FF6B6B',
    },
    browseButton: {
      backgroundColor: '#45B7D1',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 10,
    },
    footerText: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 15,
    },
    authButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '88%',
      alignSelf: 'center',
      gap: 16,
    },
    authButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
    },
    authButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    chatButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#007AFF',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    }
  });  