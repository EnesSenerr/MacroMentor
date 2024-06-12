import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import { SafeAreaView } from 'react-native';

const RecipeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
//recipes koleksiyonun ulaşıp veri çekme
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(db, 'recipes');
        const querySnapshot = await getDocs(recipesRef);
        const recipesList = await Promise.all(
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
        setRecipes(recipesList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchRecipes();
  }, []);
//arama hataları fixleme
  const filteredRecipes = searchTerm.trim() === '' ? recipes : recipes.filter(recipe =>
    recipe.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFavorite = async (recipeId) => {
    try {
      const recipeDocRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeDocRef, {
        favorites: arrayUnion(recipeId),
      });
      const favoriteRecipe = recipes.find(recipe => recipe.id === recipeId);
      setFavoriteRecipes(prevFavorites => [...prevFavorites, favoriteRecipe]);
    } catch (error) {
      console.error("Error adding to favorites: ", error);
    }
  };

  const renderRecipeItem = ({ item }) => {
    const { id, tarif, imageUrl } = item;
//görünür kısım
    return (
      <View style={styles.recipeItem}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.recipeImage} />
        ) : null}
        <Text style={styles.recipeName}>{id}</Text>
        <Text style={styles.recipeDetails}>{tarif}</Text>
        <TouchableOpacity onPress={() => addToFavorite(id)}>
          <Text style={styles.addToFavoriteButton}>Favorilere Ekle</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFavoriteItem = ({ item }) => {
    const { id, tarif, imageUrl } = item;

    return (
      <TouchableOpacity style={styles.favoriteItem} onPress={() => console.log(item)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.favoriteImage} />
        ) : null}
        <Text style={styles.favoriteName}>{id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Yemek Tarifleri</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Arama..."
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
      />
      {isLoading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : filteredRecipes.length === 0 ? (
        <Text style={styles.noResultText}>Arama sonucu bulunamadı.</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id}
        />
      )}

      <Text style={styles.sectionTitle}>Favori Tarifler</Text>
      <FlatList
        data={favoriteRecipes}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
    </SafeAreaView>
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
  recipeItem: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  recipeDetails: {
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
  favoriteName: {
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
});

export default RecipeScreen;
