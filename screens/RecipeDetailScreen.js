import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { firestore, storage } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const RecipeDetailScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(firestore, 'recipes');
        const snapshot = await getDocs(recipesRef);

        const recipesData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = '';
            if (data.recipeImage) {
              const imageRef = ref(storage, data.recipeImage);
              imageUrl = await getDownloadURL(imageRef);
            }
            return { id: doc.id, ...data, imageUrl };
          })
        );

        setRecipes(recipesData);
      } catch (error) {
        console.error('Tarifler alınırken hata oluştu:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipePress = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipePress(item)}>
      <View style={styles.recipeItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.recipeName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {selectedRecipe && (
        <ScrollView contentContainerStyle={styles.selectedRecipeContainer}>
          <Image source={{ uri: selectedRecipe.imageUrl }} style={styles.selectedRecipeImage} />
          <Text style={styles.selectedRecipeName}>{selectedRecipe.recipeName}</Text>
          <Text style={styles.selectedRecipeDetails}>Detaylar: {selectedRecipe.recipeDetails}</Text>
          <Text style={styles.selectedRecipeDetails}>Tarif: {selectedRecipe.tarif}</Text>
          
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recipeInfo: {
    marginLeft: 10,
    flex: 1,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedRecipeContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedRecipeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedRecipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedRecipeDetails: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default RecipeDetailScreen;
