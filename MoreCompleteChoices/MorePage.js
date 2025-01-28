import React, { useEffect, useRef, useState } from "react";
import Container from "../component/Container";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { IconButton, List, Searchbar } from "react-native-paper";
import Vrow from "../component/Vrow";
import Vcol from "../component/Vcol";
import { useNavigation } from "@react-navigation/native";

export default function MorePage({ route }) {
  const inputWidth = useRef(new Animated.Value(50)).current;
  const [page, setPage] = useState(1);
  const [dataMore, setDataMore] = useState([]);
  const [searchValue, setSearch] = useState(null);
  const { movieId, isTvSeries } = route.params;
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_KEY = "f1039e750b66732eb02758bb918b0190";
  const TRENDING_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
  const TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;
  const TV_SERIES = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`;
  const navigation = useNavigation();

  const getUrl = () => {
    if (movieId === "trending" && isTvSeries === false) {
      return TRENDING_URL;
    }
    if (movieId === "toprated" && isTvSeries === false) {
      return TOP_RATED;
    }
    if (movieId === "tvSeriesList" && isTvSeries === true) {
      return TV_SERIES;
    }
  };

  const toggleInput = () => {
    if (showSearch) {
      Animated.timing(inputWidth, {
        toValue: 50,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setShowSearch(false));
      setSearch(null);
    } else {
      setShowSearch(true);
      Animated.timing(inputWidth, {
        toValue: 300,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  };

  const onLoadMorePage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setPage((prevPage) => prevPage + 1);
      const url = getUrl();
      const shootUrl = await axios.get(`${url}&page=${page}`);
      setDataMore((prevData) => [...prevData, ...shootUrl.data.results]);
    } catch (err) {
      console.log("gagal load data");
    } finally {
      setLoading(false);
      console.log("succes load data");
    }
  };
  useEffect(() => {
    onLoadMorePage();
  }, []);
  return (
    <Container bgColor="black">
      <View style={{ margin: 10 }}>
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
      </View>
      <FlatList
        ListFooterComponent={
          loading ? <ActivityIndicator size={"large"} color={"tomato"} /> : null
        }
        onEndReached={onLoadMorePage}
        onEndReachedThreshold={0.5}
        data={
          searchValue
            ? dataMore.filter((item) =>
                (item.original_title || item.name)
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
            : dataMore
        }
        renderItem={({ item }) => (
          <List.Item
            onPress={() =>
              navigation.navigate("detail", {
                movieId: item.id,
                isTvSeries: isTvSeries,
              })
            }
            left={() => (
              <Vrow align="center">
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={{ width: 100, height: 150, borderRadius: 5 }}
                />
                <Vcol>
                  <Text
                    style={{
                      marginLeft: 10,
                      color: "white",
                      fontFamily: "Poppins_500Medium",
                      fontSize: 16,
                    }}
                  >
                    {item.original_title || item.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      color: "gray",
                      fontFamily: "Poppins_500Medium",
                      fontSize: 12,
                    }}
                  >
                    {item.overview}
                  </Text>
                </Vcol>
              </Vrow>
            )}
          ></List.Item>
        )}
      />
    </Container>
  );
}
