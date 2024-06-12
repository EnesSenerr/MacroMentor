import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, firestore } from "./firebaseConfig"; // firestore nesnesini import edin
import { doc, setDoc } from "firebase/firestore";

const BMRCalculatorScreen = ({ navigation }) => {
  const [gender, setGender] = useState(""); 
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState(""); 
  const [age, setAge] = useState(""); 
  const [activityLevel, setActivityLevel] = useState(""); 
  const [goal, setGoal] = useState(""); 
  const [bodyFat, setBodyFat] = useState(""); 
  const [result, setResult] = useState(""); 

  const calculateBMR = async () => {
    // Giriş kontrolleri
    if (!gender || !weight || !height || !age || !activityLevel || !goal) {
      setResult("Lütfen tüm bilgileri doldurun.");
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    const bodyFatNum = parseFloat(bodyFat) || 0; // Vücut yağı boşsa 0 olarak kabul et

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || bodyFatNum < 0 || bodyFatNum > 100) {
      setResult("Lütfen geçerli sayılar girin.");
      return;
    }

    // BMR hesaplama
    let BMR;
    if (gender === "Erkek") {
      BMR = 88.362 + 13.397 * weightNum + 4.799 * heightNum - 5.677 * ageNum;
    } else {
      BMR = 447.593 + 9.247 * weightNum + 3.098 * heightNum - 4.330 * ageNum;
    }

    // Aktivite faktörü
    let activityFactor;
    switch (activityLevel) {
      case "Hafif": activityFactor = 1.2; break;
      case "Orta": activityFactor = 1.375; break;
      case "Yoğun": activityFactor = 1.55; break;
      case "Çok Yoğun": activityFactor = 1.725; break;
      default: activityFactor = 1.2; // Varsayılan olarak hafif aktivite
    }

    // Kalori hedefi
    let dailyCalories;
    switch (goal) {
      case "Zayıflama": dailyCalories = BMR * activityFactor - 500; break;
      case "Kilo Alma": dailyCalories = BMR * activityFactor + 500; break;
      case "Hızlı Kilo Alma": dailyCalories = BMR * activityFactor + 1000; break;
      case "Kilomu Korumak": dailyCalories = BMR * activityFactor; break;
      default: dailyCalories = BMR * activityFactor; // Varsayılan olarak kilo koruma
    }

    // Yağsız vücut kütlesi ve yağ kütlesi
    const leanBodyMass = weightNum * (1 - bodyFatNum / 100);
    const fatMass = weightNum - leanBodyMass;

    // Makro besinler
    const photoURL = "";
    const proteinGrams = leanBodyMass * 2.2;
    const fatGrams = (dailyCalories * 0.25) / 9;
    const carbohydrateGrams = (dailyCalories - (proteinGrams * 4 + fatGrams * 9)) / 4;
    const roundedDailyCalories = Math.round(dailyCalories);
    const roundedProteinGrams = Math.round(proteinGrams);
    const roundedFatGrams = Math.round(fatGrams);
    const roundedCarbohydrateGrams = Math.round(carbohydrateGrams);
    // Sonuçları Firestore'a kaydet
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(firestore, "users", user.uid), {
          age: parseInt(age),
          height: parseInt(height),
          weight: parseInt(weight),
          gender,
          activityLevel,
          goal,
          bodyFat: parseFloat(bodyFat) || 0, // Vücut yağı boşsa 0 olarak kaydet
          BMR,
          dailyCalories: roundedDailyCalories,
          proteinGrams: roundedProteinGrams,
          fatGrams: roundedFatGrams,
          carbohydrateGrams: roundedCarbohydrateGrams,
          photoURL
        }, { merge: true }); // Var olan diğer verileri koru

        Alert.alert("Başarılı", "BMR sonuçlarınız kaydedildi!");
        navigation.navigate("Profile");
      } else {
        console.log("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("BMR sonuçları kaydedilirken hata oluştu:", error);
    }

    // Sonucu ekrana yazdır
    setResult(
      `Günlük Kalori İhtiyacınız: ${dailyCalories.toFixed(2)} kcal\n` +
      `Protein: ${proteinGrams.toFixed(2)} g\n` +
      `Karbonhidrat: ${carbohydrateGrams.toFixed(2)} g\n` +
      `Yağ: ${fatGrams.toFixed(2)} g`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cinsiyet:</Text>
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity style={[styles.radioButton, gender === "Erkek" && styles.selected]} onPress={() => setGender("Erkek")}>
          <Text style={styles.radioButtonText}>Erkek</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radioButton, gender === "Kadın" && styles.selected]} onPress={() => setGender("Kadın")}>
          <Text style={styles.radioButtonText}>Kadın</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Kilo (kg):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} />

      <Text style={styles.label}>Boy (cm):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} />

      <Text style={styles.label}>Yaş:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />

      <Text style={styles.label}>Hareket Seviyesi:</Text>
      <View style={styles.activityLevelContainer}>
        <TouchableOpacity style={[styles.activityLevelButton, activityLevel === "Hafif" && styles.selectedActivityLevel]} onPress={() => setActivityLevel("Hafif")}>
          <Text style={styles.activityLevelButtonText}>Hafif</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.activityLevelButton, activityLevel === "Orta" && styles.selectedActivityLevel]} onPress={() => setActivityLevel("Orta")}>
          <Text style={styles.activityLevelButtonText}>Orta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.activityLevelButton, activityLevel === "Yoğun" && styles.selectedActivityLevel]} onPress={() => setActivityLevel("Yoğun")}>
          <Text style={styles.activityLevelButtonText}>Yoğun</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.activityLevelButton, activityLevel === "Çok Yoğun" && styles.selectedActivityLevel]} onPress={() => setActivityLevel("Çok Yoğun")}>
          <Text style={styles.activityLevelButtonText}>Çok Yoğun</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Hedef:</Text>
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity style={[styles.radioButton, goal === "Zayıflama" && styles.selected]} onPress={() => setGoal("Zayıflama")}>
          <Text style={styles.radioButtonText}>Zayıflama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radioButton, goal === "Kilo Alma" && styles.selected]} onPress={() => setGoal("Kilo Alma")}>
          <Text style={styles.radioButtonText}>Kilo Alma</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radioButton, goal === "Hızlı Kilo Alma" && styles.selected]} onPress={() => setGoal("Hızlı Kilo Alma")}>
          <Text style={styles.radioButtonText}>Hızlı Kilo Alma</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radioButton, goal === "Kilomu Korumak" && styles.selected]} onPress={() => setGoal("Kilomu Korumak")}>
          <Text style={styles.radioButtonText}>Kilomu Korumak</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Vücut Yağı (%):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={bodyFat}
        onChangeText={setBodyFat}
        placeholder="Opsiyonel"
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMR}>
        <Text style={styles.calculateButtonText}>Hesapla</Text>
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#f9f9f9",
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
  radioButtonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  radioButton: {
    backgroundColor: "gray",
    paddingVertical: 15,
    paddingHorizontal: 13,
    marginRight: 10,
    borderRadius: 20,
  },
  radioButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  activityLevelButtonText:{
      color: "#fff",
      fontSize: 16,
  },
  selected: {
    backgroundColor: "#0056b3",
  },
  activityLevelContainer: {
    flexDirection: "row",
    marginBottom: 20,
    
  },
  activityLevelButton: {
    backgroundColor: "gray",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    
  },
  selectedActivityLevel: {
    backgroundColor: "#0056b3",
  },
  calculateButton: {
    backgroundColor: "#0056b3",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "#e5ffff",
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  resultText: {
    fontSize: 18,
  },
});


// ... (stiller aynı kalıyor)

export default BMRCalculatorScreen;
