import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db, storage } from './firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

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

  const navigateToRecipe = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };
//şimdilik text ama ilerde databaseden alıcak.
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sağlıklı Beslenme</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Kalori Hedefi</Text>
        <View style={styles.calorieCard}>
          <Text style={styles.calorieText}>2000 kcal</Text>
          <Text style={styles.calorieSubText}>Bugünkü Hedefiniz</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popüler Tarifler</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => navigateToRecipe(recipe.id)}>
                <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{recipe.id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favori Tarifler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Favori tarifler burada gösterilecek */}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#6FCF97',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  calorieCard: {
    backgroundColor: '#FFEB3B',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  calorieText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieSubText: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  recipeCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginRight: 10,
    width: 150,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 100,
  },
  recipeName: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MainScreen;
