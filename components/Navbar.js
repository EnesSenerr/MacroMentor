import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Navbar = ({ navigation }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Main")} // AnaSayfa'ya git
      >
        <Ionicons name="home-outline" size={24} color="black" />
        <Text style={styles.navText}>AnaSayfa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Besin")} // Besin sayfasına git
      >
        <Ionicons name="nutrition-outline" size={24} color="black" />
        <Text style={styles.navText}>Besin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("YemekTarifleri")} // YemekTarifleri sayfasına git
      >
        <Ionicons name="fast-food-outline" size={24} color="black" />
        <Text style={styles.navText}>Yemek Tarifleri</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Sohbet")} // Sohbet sayfasına git
      >
        <Ionicons name="chatbubble-outline" size={24} color="black" />
        <Text style={styles.navText}>Sohbet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Profil")} // Profil sayfasına git
      >
        <Ionicons name="person-outline" size={24} color="black" />
        <Text style={styles.navText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "black",
  },
});

export default Navbar;
