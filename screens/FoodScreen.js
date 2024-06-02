import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

const MainScreen = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [recentlySearchedFoods, setRecentlySearchedFoods] = useState([]);
//foods koleksiyonundan veri çekme
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsRef = collection(db, 'foods');
        const querySnapshot = await getDocs(foodsRef);
        const foodsList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = '';
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath);
              imageUrl = await getDownloadURL(imageRef);
            }
            return {
              id: doc.id,
              ...data,
              imageUrl,
            };
          })
        );
        setFoods(foodsList);
        setIsLoading(false); // Veri yükleme tamamlandığında yükleniyor durumunu kapat
      } catch (error) {
        console.error("Error fetching foods: ", error);
      }
    };

    fetchFoods();
  }, []);
//arama hatası giderme
  const filteredFoods = searchTerm.trim() === '' ? [] : foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFavorite = async (foodId) => {
    try {
      const foodDocRef = doc(db, 'foods', foodId);
      await updateDoc(foodDocRef, {
        favorites: arrayUnion(foodId),
      });
      // Favoriye eklenen besini favori listesine ekle
      const favoriteFood = foods.find(food => food.id === foodId);
      setFavoriteFoods(prevFavorites => [...prevFavorites, favoriteFood]);
    } catch (error) {
      console.error("Error adding to favorites: ", error);
    }
  };

  const renderFoodItem = ({ item }) => {
    const { type, name, calori, protein, imageUrl } = item;
//görünür kısım
    return (
      <View style={styles.foodItem}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.foodImage} />
        ) : null}
        <Text style={styles.foodName}>{name}</Text>
        <Text style={styles.foodType}>{type}</Text>
        <Text style={styles.foodDetails}>Kalori: {calori}</Text>
        <Text style={styles.foodDetails}>Protein: {protein} gr</Text>
        <TouchableOpacity onPress={() => addToFavorite(item.id)}>
          <Text style={styles.addToFavoriteButton}>Favorilere Ekle</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFavoriteItem = ({ item }) => {
    const { name, type, calori, protein, imageUrl } = item;

    return (
      <TouchableOpacity style={styles.favoriteItem} onPress={() => console.log(item)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.favoriteImage} />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Besinler</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Arama..."
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
      />
      {isLoading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : filteredFoods.length === 0 ? (
        <Text style={styles.noResultText}>Arama sonucu bulunamadı.</Text>
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={item => item.id}
        />
      )}

      <Text style={styles.sectionTitle}>Favori Besinler</Text>
      <FlatList
        data={favoriteFoods}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
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
    width: '100%',
    height: 200,
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

export default MainScreen;
