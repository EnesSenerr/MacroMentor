import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainScreen from './screens/MainScreen';
import FoodScreen from './screens/FoodScreen';
import Navbar from './components/Navbar';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome">
          {props => <WelcomeScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Besin" component={FoodScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
    </NavigationContainer>
  );
}
