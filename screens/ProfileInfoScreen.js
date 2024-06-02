import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";

const ProfileInfoScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const handleSave = () => {
    // Verileri Firebase'e kaydet
    // Firebase'e veri kaydedildikten sonra BMR ekranına yönlendir
    navigation.navigate("Profile");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Ad</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Adınızı girin" />

        <Text style={styles.label}>Soyad</Text>
        <TextInput style={styles.input} value={surname} onChangeText={setSurname} placeholder="Soyadınızı girin" />

        <Text style={styles.label}>Telefon Numarası</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Telefon numaranızı girin" keyboardType="phone-pad" />

        <Text style={styles.label}>Cinsiyet</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity style={[styles.genderButton, gender === "Erkek" && styles.selectedGender]} onPress={() => setGender("Erkek")}>
            <Text style={styles.genderButtonText}>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.genderButton, gender === "Kadın" && styles.selectedGender]} onPress={() => setGender("Kadın")}>
            <Text style={styles.genderButtonText}>Kadın</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGender: {
    backgroundColor: "#0056b3",
  },
  saveButton: {
    backgroundColor: "#0056b3",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileInfoScreen;
