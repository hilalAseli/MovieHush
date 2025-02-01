import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  FlatList,
  ToastAndroid,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../config/Firebase";
import { IconButton, Searchbar } from "react-native-paper";
import Vrow from "../component/Vrow";
import Container from "../component/Container";
import Vcol from "../component/Vcol";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputWidth = useRef(new Animated.Value(50)).current;
  const [showSearch, setShowSearch] = useState(false);
  const navigation = useNavigation();
  const API_KEY = "f1039e750b66732eb02758bb918b0190";

  const toggleInput = () => {
    if (showSearch) {
      Animated.timing(inputWidth, {
        toValue: 50,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setShowSearch(false));
    } else {
      setShowSearch(true);
      Animated.timing(inputWidth, {
        toValue: 300,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "FavoriteList"));
      const snapshot = await getDocs(q);
      const dataTemp = [];
      for (const doc of snapshot.docs) {
        const docData = doc.data();
        const { movieId } = docData;
        // movie load
        try {
          const idMovieInApiExist = dataTemp.some(
            (moviePrev) => moviePrev.id === movieId
          );
          if (!idMovieInApiExist) {
            const movieResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
            );
            if (movieResponse.status == 200) {
              dataTemp.push({ ...movieResponse.data, isTvSeries: false });
            } else {
              console.log(
                `Movie response failed for ID ${movieId}:`,
                movieResponse.status
              );
            }
          } else {
            const sameData = dataTemp.some(
              (moviePrev) => moviePrev.id === movieId
            );
            await deleteDoc(doc(db, "FavoriteList", sameData));
          }
        } catch (err) {
          console.log("movie", err);
        }
        // tv load
        try {
          const idTvInApiExist = dataTemp.some(
            (tvPrev) => tvPrev.id === movieId
          );
          if (!idTvInApiExist) {
            const tvResponse = await axios.get(
              `https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}&language=en-US`
            );
            if (tvResponse.status == 200) {
              dataTemp.push({ ...tvResponse.data, isTvSeries: true });
            } else {
              console.log(`Tv Response failed for id ${movieId}`);
            }
          } else {
            const sameData = dataTemp.some((tvPrev) => tvPrev.id === movieId);
            await deleteDoc(doc(db, "FavoriteList", sameData));
          }
        } catch (err) {
          console.log(err, "tv");
        }
      }
      setFavorites(dataTemp);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromFavorites = async (filmRemove) => {
    try {
      const q = query(collection(db, "FavoriteList"));
      const snapshot = await getDocs(q);
      let docIdRemove = snapshot.docs.find(
        (item) => item.data().movieId === filmRemove
      );
      if (docIdRemove) {
        await deleteDoc(doc(db, "FavoriteList", docIdRemove.id));
        ToastAndroid.show("Success delete", ToastAndroid.BOTTOM);
        loadFavorites();
      } else {
        ToastAndroid.show("Failed delete", ToastAndroid.BOTTOM);
      }
    } catch (err) {
      console.log(err);
      ToastAndroid.show("error delete");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          paddingHorizontal: 30,
        }}
      >
        <Vcol align="center">
          <Image
            source={require("../assets/Empty-bro.png")}
            style={{ width: 300, height: 300 }}
          />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              color: "white",
              fontSize: 14,
            }}
          >
            Anda belum menambahkan apapun ke favorite
          </Text>
        </Vcol>
      </View>
    );
  }

  return (
    <Container bgColor="black">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 25 }}>
          <Vrow align="center" justifyContent="space-between">
            <Animated.View style={{ width: inputWidth }}>
              {showSearch ? (
                <Searchbar
                  value={searchValue}
                  onChangeText={(value) => setSearch(value)}
                  icon={"magnify"}
                  autoFocus={true}
                  iconColor="gray"
                  textAlign="center"
                  style={{
                    backgroundColor: "white",
                    height: 50,
                    borderRadius: 15,
                  }}
                />
              ) : null}
            </Animated.View>
            <IconButton
              onPress={toggleInput}
              icon={showSearch ? "close" : "magnify"}
              size={30}
              style={{ backgroundColor: "gray" }}
              iconColor="white"
            />
          </Vrow>

          <View style={{ marginTop: 20, gap: 20 }}>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              Your Favorites
            </Text>
            <FlatList
              nestedScrollEnabled={true}
              data={
                searchValue
                  ? favorites.filter((item) =>
                      (item.original_title || item.name)
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                  : favorites
              }
              renderItem={({ item }) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    marginBottom: 20,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("detail", {
                        movieId: item.id,
                        isTvSeries: item.isTvSeries,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      style={{ width: 100, height: 150, borderRadius: 5 }}
                    />
                  </TouchableOpacity>
                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins_500Medium",
                        fontSize: 16,
                      }}
                    >
                      {item.original_title || item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromFavorites(item.id)}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontFamily: "Poppins_400Regular",
                          fontSize: 14,
                          marginTop: 5,
                        }}
                      >
                        Remove from favorites
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
