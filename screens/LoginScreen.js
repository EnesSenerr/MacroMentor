import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from '@firebase/auth';

const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//Gerekli kontroller
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Lütfen e-posta ve şifrenizi girin.");
      }

      if (password.length < 6) {
        throw new Error("Şifreniz en az 6 karakter olmalıdır.");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Kullanıcı giriş yaptı:", user.uid);
      onLogin();
      navigation.navigate("ProfileInfo");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        Alert.alert("Giriş Hatası", "Şifreniz yanlış. Lütfen tekrar deneyin.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Giriş Hatası", "Bu e-posta ile kayıtlı bir hesap bulunamadı.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Giriş Hatası", "Geçersiz kimlik bilgileri. Lütfen tekrar deneyin.");
      } else {
        Alert.alert("Giriş Hatası", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Giriş Yap</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  goBackButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
