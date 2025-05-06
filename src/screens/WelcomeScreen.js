// External Libraries
import React from 'react';
import { SafeAreaView } from 'react-native';

// Internal Components
import { Header } from '../components/welcome/Header';
import { UserInfo } from '../components/welcome/UserInfo';
import { ActionButtons } from '../components/welcome/ActionButtons';
import { AuthSection } from '../components/welcome/AuthSection';
import { ChatButton } from '../components/welcome/ChatButton';

// Custom Hooks and Styles
import { useWelcome } from '../hooks/welcome/useWelcome';
import { styles } from '../styles/welcome';

/**
 * @fileoverview Welcome Screen Component - UniFind Application
 * @description The main welcome screen of the application that displays different UI based on user authentication state
 * @features
 * - Conditional rendering based on auth state
 * - User information display
 * - Navigation to core features
 * - Authentication section
 * @returns {JSX.Element} Welcome screen structure with dynamic content based on auth state
 */

export default function WelcomeScreen({ navigation }) {
    // Getting all handlers and state from custom hook
    const {
        userName,
        handleLogout,
        handleReportItem,
        handleBrowseItems,
        handleChatPress
    } = useWelcome(navigation);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header section with user info and logout - visible only when user is logged in */}
            <Header>
                {userName && (
                    <UserInfo 
                        userName={userName} 
                        onLogout={handleLogout} 
                    />
                )}
            </Header>

            {/* Main action buttons - always visible */}
            <ActionButtons 
                onReportItem={handleReportItem}
                onBrowseItems={handleBrowseItems}
            />
            
            {/* Authentication section - visible when user is not logged in */}
            {!userName && (
                <AuthSection navigation={navigation} />
            )}

            {/* Chat button - visible only when user is logged in */}
            {userName && (
                <ChatButton onPress={handleChatPress} />
            )}
        </SafeAreaView>
    );
}
