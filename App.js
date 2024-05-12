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
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { initializeApp } from '@firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyD7CIrHeRUl9t_hS9C-YNzdVu-b0d0-_hA",
  authDomain: "macromentor-bcd7b.firebaseapp.com",
  projectId: "macromentor-bcd7b",
  storageBucket: "macromentor-bcd7b.appspot.com",
  messagingSenderId: "447252129233",
  appId: "1:447252129233:web:ecb7d04f56327866e1ecf0",
  measurementId: "G-0FD5P6TPFG"
};

const app = initializeApp(firebaseConfig);
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
