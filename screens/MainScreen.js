import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from './firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { SafeAreaView } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

const MainScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [dailyGoals, setDailyGoals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
  });
  const [remainingGoals, setRemainingGoals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
  });
  const [addedFoods, setAddedFoods] = useState([]);

  useEffect(() => {
    const fetchDailyGoals = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const { dailyCalories, proteinGrams, fatGrams, carbohydrateGrams } = userData;
          setDailyGoals({
            calories: dailyCalories,
            protein: proteinGrams,
            fat: fatGrams,
            carbohydrate: carbohydrateGrams,
          });
          setRemainingGoals({
            calories: dailyCalories,
            protein: proteinGrams,
            fat: fatGrams,
            carbohydrate: carbohydrateGrams,
          });
          setAddedFoods(userData.addedFoods || []);
        }
      }
    };

    if (isFocused) {
      fetchDailyGoals();
    }
  }, [isFocused]);

  useEffect(() => {
    const calculateRemainingGoals = () => {
      const totals = addedFoods.reduce(
        (acc, food) => {
          const calories = parseFloat(food.calori) || 0;
          const protein = parseFloat(food.protein) || 0;
          const fat = parseFloat(food.yag) || 0;
          const carbohydrate = parseFloat(food.karbonhidrat) || 0;

          acc.calories += calories;
          acc.protein += protein;
          acc.fat += fat;
          acc.carbohydrate += carbohydrate;

          return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbohydrate: 0 }
      );

      setRemainingGoals({
        calories: dailyGoals.calories - totals.calories,
        protein: dailyGoals.protein - totals.protein,
        fat: dailyGoals.fat - totals.fat,
        carbohydrate: dailyGoals.carbohydrate - totals.carbohydrate,
      });
    };

    calculateRemainingGoals();
  }, [addedFoods, dailyGoals]);

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.foodDetails}>Kalori: {item.calori}</Text>
      <Text style={styles.foodDetails}>Protein: {item.protein} g</Text>
      <Text style={styles.foodDetails}>Yağ: {item.yag} g</Text>
      <Text style={styles.foodDetails}>Karbonhidrat: {item.karbonhidrat} g</Text>
    </View>
  );

  const deleteFood = async (foodId) => {
    // Veritabanından yiyeceği sil
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const foodToRemove = addedFoods.find(food => food.id === foodId);
        await updateDoc(userDocRef, {
          addedFoods: arrayRemove(foodToRemove)
        });
      }
    } catch (error) {
      console.error('Error deleting food from database:', error);
      return;
    }
  
    // Yerel state'den yiyeceği sil
    const updatedFoods = addedFoods.filter(food => food.id !== foodId);
    setAddedFoods(updatedFoods);
  };

  const clearList = async () => {
    try {
      // Yerel durumu sıfırla
      setAddedFoods([]);
      
      // Veritabanındaki verileri temizle
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          addedFoods: []
        });
      }
    } catch (error) {
      console.error('Error clearing food list:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Günlük Makro Değerleriniz</Text>
      <Text style={styles.macroText}>Kalori: {dailyGoals.calories}</Text>
      <Text style={styles.macroText}>Protein: {dailyGoals.protein} g</Text>
      <Text style={styles.macroText}>Yağ: {dailyGoals.fat} g</Text>
      <Text style={styles.macroText}>Karbonhidrat: {dailyGoals.carbohydrate} g</Text>

      <Text style={styles.title}>Kalan Makro Değerleriniz</Text>
      <Text style={styles.macroText}>Kalori: {remainingGoals.calories.toFixed(2)}</Text>
      <Text style={styles.macroText}>Protein: {remainingGoals.protein.toFixed(2)} g</Text>
      <Text style={styles.macroText}>Yağ: {remainingGoals.fat.toFixed(2)} g</Text>
      <Text style={styles.macroText}>Karbonhidrat: {remainingGoals.carbohydrate.toFixed(2)} g</Text>

      <FlatList
        data={addedFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => deleteFood(item.id)}>
            {renderFoodItem({ item })}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Besin')}>
        <Text style={styles.buttonText}>Yemek Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearList}>
        <Text style={styles.buttonText}>Listeyi Sıfırla</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
      
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  macroText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  foodItem: {
    backgroundColor: '#e9e9e9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  foodDetails: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MainScreen;
