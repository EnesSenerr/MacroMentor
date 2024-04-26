import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen'; //
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainScreen from './screens/MainScreen';
import FoodScreen from './screens/FoodScreen';
import Navbar from './components/Navbar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{headerShown: false}}     
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="Main" component={MainScreen}/>
        <Stack.Screen name="Besin" component={FoodScreen}/>
      </Stack.Navigator>
      <Navbar />
    </NavigationContainer>
  );
}
