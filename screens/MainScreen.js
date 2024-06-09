import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const MainScreen = ({ navigation }) => {
  const [dailyMacros, setDailyMacros] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodList, setFoodList] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFoodList, setShowFoodList] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setDailyMacros(docSnap.data());
          } else {
            setError("Kullanıcı bilgileri bulunamadı.");
          }
        }
      } catch (error) {
        setError("Veriler yüklenirken bir hata oluştu.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodList = async () => {
      try {
        const foodQuery = query(collection(firestore, 'foods'));
        const querySnapshot = await getDocs(foodQuery);
        const foods = [];
        querySnapshot.forEach((doc) => {
          foods.push({ id: doc.id, ...doc.data() });
        });
        setFoodList(foods);
      } catch (error) {
        console.error("Yemek listesi alınırken hata oluştu:", error);
      }
    };

    fetchUserData();
    fetchFoodList();
  }, []);

  const handleAddFood = async () => {
    if (selectedFood && dailyMacros) {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocRef = doc(firestore, "users", user.uid);
          
          // Seçilen yemeğin kalori miktarını bir sayıya dönüştür
          const foodCalories = parseInt(selectedFood.calories);
  
          // Günlük kalori miktarından seçilen yemeğin kalori miktarını çıkar
          const remainingCalories = dailyMacros.dailyCalories - foodCalories;
          
          // Günlük kalori miktarını güncelle
          await updateDoc(userDocRef, {
            dailyCalories: remainingCalories
          });
  
          // Kullanıcı verilerini güncelle
          const docSnap = await getDoc(userDocRef);
          setDailyMacros(docSnap.data());
  
          // Eklenen yemeği kullanıcıya göstermek için (isteğe bağlı)
          alert(`${selectedFood.name} eklendi!`);
  
          // Seçimi sıfırla
          setSelectedFood(null); 
        }
      } catch (error) {
        console.error("Yemek eklenirken hata oluştu:", error);
      }
    }
  };
  

  const filteredFoodList = foodList.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş Geldiniz!</Text>
      {dailyMacros && (
        <View style={styles.caloriesContainer}>
          <Text style={styles.macroText}>Günlük Kalori: {dailyMacros.dailyCalories} kcal</Text>
          <Text style={styles.macroText}>Protein: {dailyMacros.proteinGrams} g</Text>
          <Text style={styles.macroText}>Yağ: {dailyMacros.fatGrams} g</Text>
          <Text style={styles.macroText}>Karbonhidrat: {dailyMacros.carbohydrateGrams} g</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowFoodList(!showFoodList)}>
        <Ionicons name="fast-food-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Günlük Yiyecek Takibi</Text>
      </TouchableOpacity>

      {showFoodList && (
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Yemek ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredFoodList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setSelectedFood(item);
                setShowFoodList(false);
              }}>
                <Text>{item.name} - {item.calories} kcal</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedFood && (
        <TouchableOpacity style={styles.button} onPress={handleAddFood}>
          <Text style={styles.buttonText}>Ekle: {selectedFood.name}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Profil</Text>
      </TouchableOpacity>

      {/* Yemek listesi */}
      <View style={styles.foodListContainer}>
        <Text style={styles.foodListTitle}>Yemek Listesi</Text>
        <FlatList
          data={foodList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.foodListItem} onPress={() => setSelectedFood(item)}>
              <Text style={styles.foodListItemText}>{item.name}</Text>
              <Text style={styles.foodListItemText}>{item.calories} kcal</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  caloriesContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  macroText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#0056b3",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  foodListContainer: {
    marginTop: 20,
  },
  foodListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  foodListItemText: {
    fontSize: 16,
  },
});

export default MainScreen;
