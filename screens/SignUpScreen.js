import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { doc, setDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';


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
const db = getFirestore();

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//şifre e-posta kontrolü
  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        Alert.alert("Geçersiz Şifre", "Şifreniz en az 6 karakter olmalıdır.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserDocument(user.uid, {
        firstName: firstName,
        lastName: lastName,
        phone: phone
      });

      console.log("Kullanıcı kaydedildi:", user.uid);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Kayıt Hatası", error.message);
    }
  };
//firestore belge kontrolü
  const createUserDocument = async (userId, userData) => {
    try {
      await setDoc(doc(collection(db, "users"), userId), userData);
      console.log("Kullanıcı belgesi oluşturuldu:", userId);
    } catch (error) {
      console.error("Kullanıcı belgesi oluşturulamadı:", error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Kayıt Ol</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ad"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon No"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
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
  registerButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;