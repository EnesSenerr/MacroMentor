import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [recentlySearched, setRecentlySearched] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      return;
    }

    // Arama sonucunu recentlySearched listesine ekleyelim
    const updatedRecentlySearched = [searchQuery, ...recentlySearched.slice(0, 6)];
    setRecentlySearched(updatedRecentlySearched);
  };

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>Sağlıklı Beslenme Uygulaması</Text>

      {/* Arama kısmı */}
      <View style={styles.searchContainer}>
        {/* Arama kutusu */}
        <View style={styles.inputContainer}>
          {/* Arama ikonu */}
          <Ionicons name="search-outline" size={24} color="black" />
          {/* Arama metni kutusu */}
          <TextInput
            style={styles.input}
            placeholder="Arama yapın..."
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
        </View>
        {/* Arama düğmesi */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>

      {/* Son aranan yiyecekler */}
      <ScrollView style={styles.recentlySearchedContainer}>
        <Text style={styles.recentlySearchedTitle}>Son Aranan Yiyecekler</Text>
        {recentlySearched.map((food, index) => (
          <TouchableOpacity key={index} style={styles.recentlySearchedItem}>
            <Text style={styles.recentlySearchedText}>{food}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    flex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recentlySearchedContainer: {
    flex: 1,
  },
  recentlySearchedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recentlySearchedItem: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  recentlySearchedText: {
    fontSize: 16,
  },
});

export default LoginScreen;
