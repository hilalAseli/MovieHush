import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "../component/Container";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { IconButton, List, Searchbar } from "react-native-paper";
import Vrow from "../component/Vrow";
import Vcol from "../component/Vcol";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
export default function MorePage({ route }) {
  const [showPicker, setShowPicker] = useState(false);
  const [picker, setPicker] = useState("");
  const inputWidth = useRef(new Animated.Value(50)).current;
  const filterWidth = useRef(new Animated.Value(50)).current;
  const [page, setPage] = useState(1);
  const [dataMore, setDataMore] = useState([]);
  const [searchValue, setSearch] = useState(null);
  const { movieId, isTvSeries } = route.params;
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPicker, setLoadingPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [genres, setGenres] = useState([]);
  const API_KEY = "f1039e750b66732eb02758bb918b0190";
  const TRENDING_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
  const TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;
  const TV_SERIES = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`;
  const navigation = useNavigation();

  const getGenres = async () => {
    if (loadingPicker) return;
    setLoadingPicker(true);
    try {
      const url = isTvSeries
        ? `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US&page=${page}`
        : `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US&page=${page}`;
      const response = await axios.get(url);
      setGenres(response.data.genres);
      console.log("success get genres");
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPicker(false);
    }
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setDataMore([]);
    await onLoadMorePage();
    setRefreshing(false);
  };

  const toggleInput = () => {
    if (showSearch) {
      Animated.timing(inputWidth, {
        toValue: 50,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setShowSearch(false));
      setSearch(null);
    } else {
      setShowSearch(true);
      Animated.timing(inputWidth, {
        toValue: 200,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleFilter = () => {
    if (showPicker) {
      Animated.timing(filterWidth, {
        toValue: 50,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setShowPicker(false));
    } else {
      Animated.timing(filterWidth, {
        toValue: 300,
        duration: 500,
        useNativeDriver: false,
      }).start();
      setShowPicker(true);
    }
  };

  const onLoadMorePage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setPage((prevPage) => prevPage + 1);
      const url = getUrl();
      const response = await axios.get(`${url}&page=${page}`);
      const newData = response.data.results;
      const uniqeData = newData.filter(
        (item) => !dataMore.some((Prev) => Prev.id === item.id)
      );
      setDataMore((prevData) => [...prevData, ...uniqeData]);
    } catch (err) {
      console.log("gagal load data");
    } finally {
      setLoading(false);
      getGenres();
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
          <IconButton
            size={30}
            onPress={() => navigation.goBack()}
            icon={"arrow-left"}
            style={{ backgroundColor: "gray" }}
            iconColor="white"
          />
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
        <Vrow
          align="center"
          justifyContent="space-between"
          style={{ marginTop: 10 }}
        >
          {showPicker && (
            <Animated.View style={{ width: filterWidth }}>
              <Picker
                selectedValue={picker}
                onValueChange={(valuechange) => {
                  setPicker(valuechange);
                  setPage(1);
                  setDataMore([]);
                  onLoadMorePage();
                }}
                style={{
                  flex: 1,
                  color: "white",
                  backgroundColor: "gray",
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Picker.Item label="Select a Genre" value={""} />
                {genres.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  />
                ))}
              </Picker>
            </Animated.View>
          )}
          <IconButton
            onPress={toggleFilter}
            icon="filter"
            size={30}
            style={{
              backgroundColor: "gray",
              borderRadius: 5,
            }}
            iconColor="white"
          />
        </Vrow>
      </View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loading || loadingPicker ? (
            <ActivityIndicator size={"large"} color={"red"} />
          ) : null
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
            : picker
            ? dataMore.filter((item) => item.genre_ids.includes(picker))
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
