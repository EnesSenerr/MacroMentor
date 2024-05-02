import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

const CalorieCalculatorScreen = () => {
  const [gender, setGender] = useState(""); // Cinsiyet
  const [weight, setWeight] = useState(""); // Kilo
  const [height, setHeight] = useState(""); // Boy
  const [age, setAge] = useState(""); // Yaş
  const [activityLevel, setActivityLevel] = useState(""); // Hareket seviyesi
  const [bodyFat, setBodyFat] = useState(""); // Opsiyonel: Yağ oranı

  const calculateBMR = () => {
    // Benedict BMR Denklemi'ni kullanarak BMR'yi hesapla
    // Hareket seviyesine göre aktivite faktörünü uygula
    // Opsiyonel olarak yağ oranını dahil et
    // Kolori, protein, yağ ve karbonhidrat bilgisini hesapla
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günlük Kolori ve Besin İhtiyacı Hesaplayıcı</Text>
      <TextInput
        style={styles.input}
        placeholder="Cinsiyet (Erkek/Kadın)"
        onChangeText={(text) => setGender(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Kilo (kg)"
        keyboardType="numeric"
        onChangeText={(text) => setWeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Boy (cm)"
        keyboardType="numeric"
        onChangeText={(text) => setHeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş"
        keyboardType="numeric"
        onChangeText={(text) => setAge(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Hareket Seviyesi (Hafif/Orta/Yoğun/Çok Yoğun)"
        onChangeText={(text) => setActivityLevel(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Yağ Oranı (%) - Opsiyonel"
        keyboardType="numeric"
        onChangeText={(text) => setBodyFat(text)}
      />
      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMR}>
        <Text style={styles.buttonText}>Hesapla</Text>
      </TouchableOpacity>
      {/* Hesaplanan bilgilerin görüntülendiği kısım */}
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
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  calculateButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CalorieCalculatorScreen;
