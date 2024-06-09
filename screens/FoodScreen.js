import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'; // getDoc import edildi
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage, auth } from './firebaseConfig'; // firestore import edildi
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const FoodScreen = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [isFavoriteSectionVisible, setIsFavoriteSectionVisible] = useState(false);
  const navigation = useNavigation(); // Add navigation


  
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsRef = collection(firestore, 'foods'); // firestore kullanıldı
        const snapshot = await getDocs(foodsRef);

        const foodsWithImages = await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageUrl = data.imagePath
            ? await getDownloadURL(ref(storage, data.imagePath))
            : null;
          return { id: doc.id, ...data, imageUrl };
        }));

        setFoods(foodsWithImages);
        // Favorileri ayarla (kullanıcı giriş yaptıysa)
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid); // firestore kullanıldı
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setFavoriteFoods(userDocSnap.data().favorites || []);
          }
        }
      } catch (error) {
        console.error("Error fetching foods: ", error);
      }
    };

    fetchFoods();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text.toLowerCase());
  };

  const toggleFavorites = () => {
    setIsFavoriteSectionVisible(!isFavoriteSectionVisible);
  };

  const addToFavorites = async (foodId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid); // firestore kullanıldı
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
      // Kullanıcı girişi yapılmamışsa, kullanıcıyı giriş yapmaya yönlendir
      Alert.alert('Giriş Yapın', 'Favorilere besin eklemek için lütfen giriş yapın.');
    }
  };

  const removeFromFavorites = async (foodId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid); // firestore kullanıldı
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

  const filteredFoods = foods.filter(food => {
    const isFavorite = favoriteFoods.includes(food.id);
    const matchesSearch = food.name.toLowerCase().includes(searchTerm);
    return isFavoriteSectionVisible ? isFavorite && matchesSearch : matchesSearch;
  });

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />}
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.foodDetails}>Kalori: {item.calori}</Text> 
      <Text style={styles.foodDetails}>Protein: {item.protein} gr</Text>
      <Text style={styles.foodDetails}>Yağ: {item.yag} gr</Text>
      <Text style={styles.foodDetails}>Karbonhidrat: {item.karbonhidrat} gr</Text>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => 
          favoriteFoods.includes(item.id) ? removeFromFavorites(item.id) : addToFavorites(item.id)
        }
      >
        <Ionicons
          name={favoriteFoods.includes(item.id) ? "heart" : "heart-outline"}
          size={24}
          color={favoriteFoods.includes(item.id) ? "red" : "black"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity style={styles.favoriteItem} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.favoriteImage} />}
      <Text style={styles.favoriteName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
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
        numColumns={2} // İki sütunlu görünüm
      />

      {isFavoriteSectionVisible && favoriteFoods.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Favori Besinler</Text>
          <FlatList
            data={foods.filter(food => favoriteFoods.includes(food.id))}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  foodItem: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  foodType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  noResultText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  addToFavoriteButton: {
    fontSize: 16,
    color: 'blue',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  favoriteItem: {
    marginRight: 10,
    borderRadius: 10,
    width: 150,
    height: 150,
    overflow: 'hidden',
  },
  favoriteImage: {
    width: '100%',
    height: '100%',
  },
});

export default FoodScreen;
