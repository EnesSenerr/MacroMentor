import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
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
const auth = getAuth(app);

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {
      // Şifrelerin aynı olup olmadığını kontrol etme
      if (password !== confirmPassword) {
        throw new Error("Girilen şifreler eşleşmiyor.");
      }

      // Firebase'e kullanıcıyı kaydetme
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
// konsoldan kullanıcı kayıt durumunu ve id sini takip etme
      console.log("Kullanıcı kaydedildi:", user.uid);

      // Başarılı kayıt sonrası işlemler
      navigation.navigate("Login");
      Alert.alert("Başarılı", "Kayıt işlemi başarıyla tamamlandı. Lütfen giriş yapın.");
    } catch (error) {
      Alert.alert("Kayıt Hatası", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Şifreyi Onayla"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Kayıt Ol</Text>
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
  registerButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;