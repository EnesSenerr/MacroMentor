import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Linking, Image, Animated } from "react-native";

const WelcomeScreen = ({ navigation, onLogin }) => {
  const [scaleValue] = useState(new Animated.Value(1));
//sayfa yönlendirmeleri
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleFeedback = () => {
    Linking.openURL("https://deneme.com");
  };
//github logosu için animasyon fonksiyonları
  const animateButton = () => {
    Animated.timing(scaleValue, {
      toValue: 2.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const resetButton = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleGithubPress = () => {
    Linking.openURL("https://github.com/EnesSenerr/MacroMentor");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.jpg")}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <Image
          source={require("../assets/images/MacroMentorLogo.png")}
          style={styles.logo}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>MacroMentor'e Hoş Geldiniz!</Text>
        <Text style={styles.description}>
          Uygulamamıza hoş geldiniz. Hedeflerinize ulaşmak için makro besinlerinizi kolayca takip edin.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Kaydol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleFeedback}
          >
            <Text style={styles.buttonText}>Geri Bildirim</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => Linking.openURL("https://deneme.com")}>
            <Text style={styles.linkText}>Gizlilik Politikası </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://deneme.com")}>
            <Text style={styles.linkText}>  Kullanım Koşulları</Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[styles.logoGithubContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <TouchableOpacity
            onPressIn={animateButton}
            onPressOut={resetButton}
            onPress={handleGithubPress}
            activeOpacity={1}
          >
            <Image
              source={require("../assets/images/github_logo.png")}
              style={styles.logoGithub}
            />
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0)",
    

  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 18,
    fontWeight:"900",
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 20,
    color: "#FFFFFF",
  },
  logoGithubContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  logoGithub: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: "rgba(74,128,77,0.8)",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  logoContainer: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
  },
  logo: {
    top: -50,
    width: 270,
    opacity: 0.78
  },
});

export default WelcomeScreen;
