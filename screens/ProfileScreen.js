import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth, storage, firestore } from "./firebaseConfig";
import BMRCalculatorScreen from "./BMRCalculatorScreen";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [showBMRCalculator, setShowBMRCalculator] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("Böyle bir belge bulunamadı!");
          }
        } catch (error) {
          console.error("Kullanıcı verileri alınırken hata oluştu:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Welcome"); // Çıkış yapınca WelcomeScreen'e git
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleBMRPress = () => {
    setShowBMRCalculator(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const uploadUrl = await uploadImageAsync(result.assets[0].uri);
        if (uploadUrl) {
          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            await updateDoc(userDocRef, {
              photoURL: uploadUrl,
            });
            // Update the state with the new photoURL
            setUserData(prevData => ({ ...prevData, photoURL: uploadUrl }));
            Alert.alert("Başarılı", "Profil fotoğrafınız güncellendi.");
          }
        }
      } catch (error) {
        Alert.alert("Hata", "Profil fotoğrafı yüklenemedi. Lütfen tekrar deneyin.");
        console.error("Error uploading image:", error);
      }
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      // Fetch the image and convert it to a blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Get the current user
      const user = auth.currentUser;
      if (user) {
        // Firebase Storage reference
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
        // Upload the blob to Firebase Storage
        await uploadBytes(storageRef, blob);
        // Close the blob
        blob.close();
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {userData ? (
          <View style={styles.profileContainer}>
            {userData.photoURL ? (
              <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.profileImagePlaceholder} onPress={pickImage}>
                <Ionicons name="person-circle-outline" size={150} color="#ccc" />
                <Text style={styles.placeholderText}>Profil Fotoğrafı Ekle</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.name}>
              {userData.firstName} {userData.lastName}
            </Text>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Yaş:</Text>
                <Text style={styles.infoValue}>{userData.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Boy:</Text>
                <Text style={styles.infoValue}>{userData.height} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kilo:</Text>
                <Text style={styles.infoValue}>{userData.weight} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cinsiyet:</Text>
                <Text style={styles.infoValue}>{userData.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Aktivite Seviyesi:</Text>
                <Text style={styles.infoValue}>{userData.activityLevel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hedef:</Text>
                <Text style={styles.infoValue}>{userData.goal}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vücut Yağ Oranı:</Text>
                <Text style={styles.infoValue}>{userData.bodyFat} %</Text>
              </View>

              {userData.BMR && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>BMR Sonuçları</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>BMR:</Text>
                    <Text style={styles.infoValue}>{userData.BMR.toFixed(2)} kcal</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Günlük Kalori:</Text>
                    <Text style={styles.infoValue}>{userData.dailyCalories.toFixed(2)} kcal</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Protein:</Text>
                    <Text style={styles.infoValue}>{userData.proteinGrams.toFixed(2)} gr</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Karbonhidrat:</Text>
                    <Text style={styles.infoValue}>{userData.carbohydrateGrams.toFixed(2)} gr</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Yağ:</Text>
                    <Text style={styles.infoValue}>{userData.fatGrams.toFixed(2)} gr</Text>
                  </View>
                </>
              )}
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Yükleniyor...</Text>
        )}

        {showBMRCalculator && (
          <BMRCalculatorScreen />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center', // Değişiklik burada
    width: '100%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 18,
    color: '#666',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  infoSection: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bmrButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bmrButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
    
    export default ProfileScreen;
