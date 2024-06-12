import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebaseConfig';
import { SafeAreaView } from 'react-native';

const AddFoodForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    calori: '',
    protein: '',
    yag: '',
    karbonhidrat: '',
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
      // Resim yükleme
      let downloadURL = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${new Date().getTime()}`);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Veritabanına ekleme
      const foodsRef = collection(firestore, 'foods');
      await addDoc(foodsRef, { ...formData, imagePath: downloadURL });

      // Başarılı mesajı ve temizleme işlemleri
      alert('Besin başarıyla eklendi!');
      setFormData({ name: '', calori: '', protein: '', yag: '', karbonhidrat: '' });
      setImage(null);
    } catch (error) {
      console.error("Besin ekleme hatası:", error);
      alert('Hata: Besin eklenemedi.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <Provider>
      <View style={styles.container}>
        <TextInput
          label="Besin Adı"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <TextInput
          label="Kalori (100g için)"
          value={formData.calori}
          onChangeText={(text) => setFormData({ ...formData, calori: text })}
          keyboardType="numeric"
        />
        <TextInput
          label="Protein (100g için)"
          value={formData.protein}
          onChangeText={(text) => setFormData({ ...formData, protein: text })}
          keyboardType="numeric"
        />
        <TextInput
          label="Yağ (100g için)"
          value={formData.yag}
          onChangeText={(text) => setFormData({ ...formData, yag: text })}
          keyboardType="numeric"
        />
        <TextInput
          label="Karbonhidrat (100g için)"
          value={formData.karbonhidrat}
          onChangeText={(text) => setFormData({ ...formData, karbonhidrat: text })}
          keyboardType="numeric"
        />
        <Button onPress={pickImage}>Resim Seç</Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button mode="contained" onPress={handleSubmit}>
          Ekle
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

export default AddFoodForm;
