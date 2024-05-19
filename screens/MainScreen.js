import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import db from './firebaseConfig';

const MainScreen = ({ navigation }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    // Firestore'dan yiyecek verilerini al
    const fetchFoods = async () => {
      try {
        const querySnapshot = await db.collection('foods').get();
        const fetchedFoods = [];
        querySnapshot.forEach((doc) => {
          fetchedFoods.push({ id: doc.id, ...doc.data() });
        });
        setFoods(fetchedFoods);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []);

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
    >
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.foodCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foods</Text>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  foodItem: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodCategory: {
    fontSize: 16,
    color: "#555",
  },
});

export default MainScreen;
