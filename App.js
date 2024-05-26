import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainScreen from './screens/MainScreen';
import FoodScreen from './screens/FoodScreen';
import Navbar from './components/Navbar';
import ProfileScreen from './screens/ProfileScreen';
import { getAuth } from '@firebase/auth';
import { app } from './screens/firebaseConfig';


const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebase Authentication'ı başlat
  useEffect(() => {
    const auth = getAuth(app);
    // Kullanıcı oturum açma durumunu kontrol et
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // Kullanıcı oturum açtıysa
      } else {
        setIsLoggedIn(false); // Kullanıcı oturumu kapattıysa
      }
    });

    // Aboneliği temizle
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
// sayfalar arası yönlendirme kısımları , navbar kontrolü
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
        <Stack.Screen name="SignUp">
          {props => <SignUpScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Besin" component={FoodScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      
      </Stack.Navigator>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
    </NavigationContainer>
  );
}
