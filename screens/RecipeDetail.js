import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

const RecipeDetail = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeDocRef = doc(db, 'recipes', recipeId);
        const recipeDoc = await getDoc(recipeDocRef);
        if (recipeDoc.exists()) {
          const data = recipeDoc.data();
          let imageUrl = '';
          if (data.imagePath) {
            const imageRef = ref(storage, data.imagePath);
            imageUrl = await getDownloadURL(imageRef);
          }
          setRecipe({ id: recipeId, ...data, imageUrl });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recipe: ", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tarif bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
      ) : null}
      <Text style={styles.recipeName}>{recipe.id}</Text>
      <Text style={styles.recipeDetails}>{recipe.tarif}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeDetails: {
    fontSize: 16,
    color: '#666',
  },
});

export default RecipeDetail;
