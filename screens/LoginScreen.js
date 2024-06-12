import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity,  Alert, Modal, ImageBackground, Image, KeyboardAvoidingView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth';
import { SafeAreaView } from 'react-native';

const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

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
      navigation.navigate("Main");
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

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      Alert.alert("E-posta Gerekli", "Lütfen şifrenizi sıfırlamak için e-posta adresinizi girin.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      Alert.alert("Şifre Sıfırlama", "Şifre sıfırlama e-postası gönderildi.");
      setIsModalVisible(false);
      setForgotPasswordEmail("");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ImageBackground
        source={require("../assets/images/background.jpg")}
        style={styles.background}
      >
        <Image
          source={require("../assets/images/MacroMentorLogo.png")}
          style={styles.logo}
        />

        <View style={[styles.card, styles.semiTransparentBackground]}>
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

          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Şifre Sıfırlama</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotPasswordEmail}
                onChangeText={(text) => setForgotPasswordEmail(text)}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleForgotPassword}>
                <Text style={styles.modalButtonText}>Şifre Sıfırla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)", 
  },
  logo: {
    width: 270,
    top: -50,
    opacity: 0.78
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Arka plan opaklığı artırıldı
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  goBackButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Daha koyu yazı rengi
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 1)", // Beyaz arka plan
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
    color: "black",
  },
  loginButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: "center", // Butonu ortala
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#2196F3', // Buton rengiyle aynı
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: "#2196F3", // Buton rengiyle aynı
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default LoginScreen;