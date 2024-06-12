import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, firestore, storage } from './firebaseConfig';
import { SafeAreaView } from 'react-native';

const AddRecipeScreen = () => {
  const [formData, setFormData] = useState({
    recipeName: '',
    recipeDetails: '',
    tarif: '', // Tarif açıklaması
  });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleSubmit = async () => {
    try {
      // Resim yükleme (eğer seçilmişse)
      let downloadURL = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `recipeImages/${new Date().getTime()}`);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Veritabanına ekleme (recipes koleksiyonuna)
      const recipesRef = collection(firestore, 'recipes');
      await addDoc(recipesRef, { ...formData, recipeImage: downloadURL });
      
      Alert.alert('Tarif Başarıyla Eklendi!');
      // Formu temizle
      setFormData({ recipeName: '', recipeDetails: '', tarif: '' });
      setImage(null);
    } catch (error) {
      console.error("Tarif ekleme hatası:", error);
      Alert.alert('Hata', 'Tarif eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <Provider>
      <View style={styles.container}>
        <TextInput
          label="Tarif Adı"
          value={formData.recipeName}
          onChangeText={(text) => setFormData({ ...formData, recipeName: text })}
        />
        <TextInput
          label="Tarif Detayları"
          value={formData.recipeDetails}
          onChangeText={(text) => setFormData({ ...formData, recipeDetails: text })}
        />
        <TextInput
          label="Tarif Açıklaması"
          value={formData.tarif}
          onChangeText={(text) => setFormData({ ...formData, tarif: text })}
          multiline // Çok satırlı giriş için
        />
        <Button onPress={pickImage}>Resim Seç</Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button mode="contained" onPress={handleSubmit}>
          Kaydet
        </Button>
      </View>
    </Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default AddRecipeScreen;