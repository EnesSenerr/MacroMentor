import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput , Keyboard, KeyboardAvoidingView, ScrollView} from "react-native";

const BMRCalculatorScreen = () => {
  const [gender, setGender] = useState(""); // Cinsiyet: "Erkek" veya "Kadın"
  const [weight, setWeight] = useState(""); // Kilo (kg)
  const [height, setHeight] = useState(""); // Boy (cm)
  const [age, setAge] = useState(""); // Yaş
  const [activityLevel, setActivityLevel] = useState(""); // Hareket Seviyesi: "Hafif", "Orta", "Yoğun", "Çok Yoğun"
  const [goal, setGoal] = useState(""); // Hedef: "Zayıflama", "Kilo Alma", "Hızlı Kilo Alma", "Kilomu Korumak"
  const [bodyFat, setBodyFat] = useState(""); // Vücut Yağı (%)
  const [result, setResult] = useState(""); // Hesaplama sonucu

  const calculateBMR = () => {
    // Cinsiyet kontrolü, diğer girişlerin boş olup olmadığı kontrolü vs. gibi mevcut kontroller burada
    if (!gender || !weight || !height || !age || !activityLevel || !goal) {
        setResult("Lütfen tüm bilgileri doldurun.");
        return;}
    // BMR hesaplama
    let BMR;
    if (gender === "Erkek") {
      BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      BMR = 655.9 + 9.63 * weight + 1.85 * height - 4.7 * age;
    }
  
    // Aktivite faktörünü hesapla
    let activityFactor;
    if (activityLevel === "Hafif") {
      activityFactor = 1.2;
    } else if (activityLevel === "Orta") {
      activityFactor = 1.375;
    } else if (activityLevel === "Yoğun") {
      activityFactor = 1.55;
    } else if (activityLevel === "Çok Yoğun") {
      activityFactor = 1.725;
    }
  
    // Kalori hedefini hesapla
    let dailyCalories;
    if (goal === "Zayıflama") {
      dailyCalories = BMR * activityFactor - 500;
    } else if (goal === "Kilo Alma") {
      dailyCalories = BMR * activityFactor + 500;
    } else if (goal === "Hızlı Kilo Alma") {
      dailyCalories = BMR * activityFactor + 1000;
    } else if (goal === "Kilomu Korumak") {
      dailyCalories = BMR * activityFactor;
    }
  
    // Vücut yağını hesapla
    let bodyFatPercentage = parseFloat(bodyFat);
    if (isNaN(bodyFatPercentage)) {
      bodyFatPercentage = 0; // Eğer kullanıcı vücut yağı girmemişse varsayılan olarak 0 al
    }
    const leanBodyMass = weight * (1 - bodyFatPercentage / 100);
    const fatMass = weight - leanBodyMass;
  
    // Protein, karbonhidrat ve yağ miktarlarını hesapla
    const proteinGrams = leanBodyMass * 2.2; // Protein ihtiyacı yağsız vücut kütlesine dayanır
    const fatGrams = (dailyCalories * 0.25) / 9; // Günde alınması gereken yağ miktarı
    const carbohydrateGrams = (dailyCalories - (proteinGrams * 4 + fatGrams * 9)) / 4; // Geriye kalan kaloriler karbonhidratlardan gelir
  
    // Sonucu ayarla
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
  

export default BMRCalculatorScreen;
