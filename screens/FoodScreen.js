import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const FoodScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlySearched, setRecentlySearched] = useState([]);

  const handleSearch = () => {
    // Arama işlemleri burada yapılacak
    // searchQuery kullanarak yemekleri ara
    // Sonuçları recentlySearched dizisine ekle
  };

  const handleFoodSelect = (food) => {
    // Besine tıklandığında çalışacak işlemler burada yapılacak
    // Seçilen besine özel bir kısım açılacak
  };

  return (
    <View style={styles.container}>
      {/* Arama kısmı */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Yemek Ara"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Son aramalar kısmı */}
      <View style={styles.recentSearchContainer}>
        <Text style={styles.recentSearchTitle}>Son Aramalar</Text>
        <FlatList
          data={recentlySearched}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleFoodSelect(item)}>
              <Text style={styles.recentSearchItem}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Seçilen besin için detaylı bilgiler kısmı */}
      {/* Bu kısım, bir besine tıklandığında açılacak */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  recentSearchContainer: {
    marginBottom: 20,
  },
  recentSearchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recentSearchItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
});

export default FoodScreen;
