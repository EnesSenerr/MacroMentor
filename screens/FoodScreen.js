import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage, auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native';

const FoodScreen = () => {
  const navigation = useNavigation();
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [isFavoriteSectionVisible, setIsFavoriteSectionVisible] = useState(false);
  const [gramValues, setGramValues] = useState({}); // Besinlerin gramaj değerlerini saklar

  useEffect(() => {
    // foods koleksiyonundaki verileri getirir
    const fetchFoods = async () => {
      // foods koleksiyonunu referans alır
      const foodsRef = collection(firestore, 'foods');
      // foods koleksiyonundaki tüm belgeleri alır
      const snapshot = await getDocs(foodsRef);

      // Her bir belgeyi işler ve resim URL'sini alır
      const foodsWithImages = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imageUrl = data.imagePath
          ? await getDownloadURL(ref(storage, data.imagePath))
          : null;
        return { id: doc.id, ...data, imageUrl };
      }));

      setFoods(foodsWithImages);

      // Kullanıcının favori besinlerini getirir
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setFavoriteFoods(userDocSnap.data().favorites || []);
        }
      }
    };

    fetchFoods();
  }, []);

  // Arama metnini günceller
  const handleSearch = (text) => {
    setSearchTerm(text.toLowerCase());
  };

  // Favori besinlerin görünürlüğünü değiştirir
  const toggleFavorites = () => {
    setIsFavoriteSectionVisible(!isFavoriteSectionVisible);
  };

  // Besini favorilere ekler
  const addToFavorites = async (foodId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          favorites: arrayUnion(foodId),
        });
        setFavoriteFoods(prevFavorites => [...prevFavorites, foodId]);
        Alert.alert('Besin favorilere eklendi!');
      } catch (error) {
        console.error("Favorilere ekleme hatası:", error);
        Alert.alert('Hata', 'Besin favorilere eklenemedi.');
      }
    } else {
      Alert.alert('Giriş Yapın', 'Favorilere besin eklemek için lütfen giriş yapın.');
    }
  };

  // Besini favorilerden kaldırır
  const removeFromFavorites = async (foodId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          favorites: arrayRemove(foodId),
        });
        setFavoriteFoods(prevFavorites => prevFavorites.filter(id => id !== foodId));
        Alert.alert('Besin favorilerden kaldırıldı!');
      } catch (error) {
        console.error("Favorilerden kaldırma hatası:", error);
        Alert.alert('Hata', 'Besin favorilerden kaldırılamadı.');
      }
    }
  };

  // Günlük listeye besin ekler
  const addToDailyList = async (food) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const adjustedFood = {
          ...food,
          calori: ((food.calori / 100) * (gramValues[food.id] || 100)).toFixed(2),
          protein: ((food.protein / 100) * (gramValues[food.id] || 100)).toFixed(2),
          yag: ((food.yag / 100) * (gramValues[food.id] || 100)).toFixed(2),
          karbonhidrat: ((food.karbonhidrat / 100) * (gramValues[food.id] || 100)).toFixed(2),
          gram: gramValues[food.id] || 100, // Her ekleme için benzersiz bir id oluştur
          id: `${food.id}_${new Date().getTime()}`, // Her ekleme için benzersiz bir id oluştur
        };
        await updateDoc(userDocRef, {
          addedFoods: arrayUnion(adjustedFood),
        });
        Alert.alert('Besin listeye eklendi!');
        navigation.navigate('Main', { reload: true }); // MainScreen'in güncellenmesini tetikle
      } catch (error) {
        console.error("Listeye ekleme hatası:", error);
        Alert.alert('Hata', 'Besin listeye eklenemedi.');
      }
    } else {
      Alert.alert('Giriş Yapın', 'Listeye besin eklemek için lütfen giriş yapın.');
    }
  };

  // Favori besini toggle eder
  const toggleFavorite = (foodId) => {
    if (favoriteFoods.includes(foodId)) {
      removeFromFavorites(foodId);
    } else {
      addToFavorites(foodId);
    }
  };

  const handleGramChange = (foodId, text) => {
    const newGram = parseFloat(text); // Girilen değeri ondalık sayıya dönüştürür
    if (!isNaN(newGram)) { // Girilen değer bir sayı mı kontrol eder
      setGramValues(prevGramValues => ({
        ...prevGramValues,
        [foodId]: newGram // Besin id'sine göre yeni gramaj değerini günceller
      }));
    }
  };

  // Besinlerin filtrelenmiş listesini oluşturur
  const filteredFoods = foods.filter(food => {
    const isFavorite = favoriteFoods.includes(food.id);
    const matchesSearch = food.name.toLowerCase().includes(searchTerm);
    return isFavoriteSectionVisible ? isFavorite && matchesSearch : matchesSearch;
  });

  // Her bir besin öğesini render eder
  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />}
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDetails}>Kalori: {item.calori}</Text>
        <Text style={styles.foodDetails}>Protein: {item.protein} gr</Text>
        <Text style={styles.foodDetails}>Yağ: {item.yag} gr</Text>
        <Text style={styles.foodDetails}>Karbonhidrat: {item.karbonhidrat} gr</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.gramInput}
        keyboardType="numeric"
        placeholder="Gram"
        value={gramValues[item.id] ? gramValues[item.id].toString() : ''} // Önceden tanımlı gramaj değeri varsa gösterir
        onChangeText={(text) => handleGramChange(item.id, text)}
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)} // Toggle favori durumunu değiştirir
      >
        <Ionicons
          name={favoriteFoods.includes(item.id) ? "heart" : "heart-outline"}
          size={24}
          color={favoriteFoods.includes(item.id) ? "red" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => addToDailyList(item)}>
        <Text style={styles.addButtonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );
    
    return (
      <SafeAreaView style={styles.container}>
    <View style={styles.container}>
    <TextInput 
         style={styles.searchInput} 
         placeholder="Besin ara..." 
         value={searchTerm}
         onChangeText={handleSearch}
       />
    <TouchableOpacity style={styles.toggleButton} onPress={toggleFavorites}>
    <Text style={styles.toggleButtonText}>
    {isFavoriteSectionVisible ? "Tüm Besinleri Görüntüle" : "Sadece Favori Besinleri Görüntüle"}
    </Text>
    </TouchableOpacity>
    <FlatList
    data={filteredFoods}
    renderItem={renderFoodItem}
    keyExtractor={(item) => item.id}
    numColumns={2}
    />
    </View>
    </SafeAreaView>
    );
    };
    
    // Stil tanımlamaları
    const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    },
    foodItem: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    width: '48%',
    marginRight: '2%',
    position: 'relative', // Favori butonunu diğer bileşenlerin üzerine yerleştirmek için
    },
    foodImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    },
    foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    },
    foodDetails: {
    fontSize: 16,
    color: '#888',
    },
    searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    },
    toggleButton: {
    marginBottom: 20,
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    },
    toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    },
    gramInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    },
    addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    },
    addButtonText: {
    color: '#fff',
    fontSize: 16,
    },
    favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    },
    });
    
    export default FoodScreen;
