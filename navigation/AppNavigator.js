import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import ReportItemScreen from '../screens/ReportItemScreen';
import LogInScreen from '../screens/LogInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BrowseLostItems from '../screens/BrowseLostItems';
import ItemDetails from '../screens/ItemDetails';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';

const Stack = createNativeStackNavigator();

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
      <View style={styles.line} />
    </View>
  );
};

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackVisible: false,
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReportItem" 
        component={ReportItemScreen}
        options={{
          title: 'Report an Item',
          header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="LogIn" 
        component={LogInScreen}
        options={{
          title: 'Log In',
          header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Register',
          header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="BrowseLostItems" 
        component={BrowseLostItems}
        options={{
            title: 'Lost Items',
            header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="ItemDetails" 
        component={ItemDetails}
        options={{
            title: 'Item Details',
            header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="Chats" 
        component={ChatScreen}
        options={{
            title: 'Chat',
            header: (props) => <CustomHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{
          title: 'Chat List',
          header: (props) => <CustomHeader {...props} />
      }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#fff',
    marginTop: 5,
  },
});