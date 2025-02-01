import React, { useEffect, useRef, useState } from "react";
import Container from "../component/Container";
import Vrow from "../component/Vrow";
import axios from "axios";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, IconButton, Searchbar } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/Firebase";
export default function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [dataFetch, setDataFetch] = useState([]);
  const [dataBanner, setDataBanner] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heart, setHeart] = useState(false);
  const width = Dimensions.get("window").width;
  const API_KEY = "f1039e750b66732eb02758bb918b0190";
  const TRENDING_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  const TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
  const TV_SERIES = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`;

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const trendingMovies = await axios.get(TRENDING_URL);
      const topRatedMovies = await axios.get(TOP_RATED);
      const tvSeries = await axios.get(TV_SERIES);
      setLoading(false);
      setDataFetch({
        trending: trendingMovies.data.results,
        toprated: topRatedMovies.data.results,
        tvSeriesList: tvSeries.data.results,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const heartHandle = async (movieId) => {
    setHeart(false);
    try {
      const q = query(collection(db, "FavoriteList"));
      const snapshot = await getDocs(q);
      const alreadyData = snapshot.docs.some((item) => {
        const data = item.data();
        return (
          data.user_email === user.primaryEmailAddress.emailAddress &&
          data.movieId === movieId
        );
      });
      if (!alreadyData) {
        const docId = `${user.fullName}-${new Date().getTime()}`;
        await setDoc(doc(db, "FavoriteList", docId), {
          user_email: user?.primaryEmailAddress.emailAddress,
          movieId: movieId,
          user_name: user?.fullName,
          created_at: new Date().toISOString(),
          userAddItem: movieId,
        });
        setHeart(true);
        ToastAndroid.show(
          "Film berhasil di tambahkan di list favorit",
          ToastAndroid.BOTTOM
        );
      } else {
        setHeart(false);
        ToastAndroid.show(
          "Film sudah pernah anda tambahkan di list favorit",
          ToastAndroid.BOTTOM
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const apiBannerOnly = async () => {
    setLoading(true);
    try {
      const trendingbanner = await axios.get(TRENDING_URL);
      const topratedbanner = await axios.get(TOP_RATED);
      const tvseriesbanner = await axios.get(TV_SERIES);

      const combineData = [
        ...trendingbanner.data.results,
        ...topratedbanner.data.results,
        ...tvseriesbanner.data.results,
      ];
      setDataBanner(combineData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    apiBannerOnly();
    fetchPopularMovies();
  }, []);
  return (
    <ScrollView style={{backgroundColor:'black'}}>
      <Container bgColor="black">
        <View style={{ alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator size={"large"} color={"red"} />
          ) : (
            <Carousel
              width={width}
              loop={false}
              height={width * 1.5}
              autoPlay={false}
              data={dataBanner.slice(0, 10)}
              onSnapToItem={(index) => setActiveIndex(index)}
              renderItem={({ item }) => (
                <Card>
                  <Card.Cover
                    style={{ borderRadius: 0, height: width * 1.5 }}
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      right: 10,
                      margin: 10,
                    }}
                  >
                    <Vrow align="center">
                      <Ionicons
                        name="star"
                        color={"gold"}
                        size={20}
                        style={{ marginBottom: 5 }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontFamily: "Montserrat_500Medium",
                          marginBottom: 5,
                          left: 5,
                          textShadowColor: "black",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 10,
                        }}
                      >
                        {item.vote_average.toFixed(1)} / 10
                      </Text>
                    </Vrow>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontFamily: "Montserrat_700Bold",
                        textShadowColor: "black",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 10,
                      }}
                    >
                      {item.title || item.original_name}
                    </Text>
                    <Vrow align="center" paddingTop="15px">
                      <TouchableOpacity
                        onPress={() => {
                          const isTvSeries = item.original_name ? true : false;
                          navigation.navigate("detail", {
                            movieId: item.id,
                            isTvSeries,
                          });
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 200,
                            height: 50,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              fontFamily: "Montserrat_700Bold",
                            }}
                          >
                            Watch Now
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <IconButton
                        icon={heart ? "bookmark" : "bookmark-outline"}
                        iconColor={heart ? "white" : "white"}
                        style={{ backgroundColor: "red", left: 5 }}
                        onPress={() => heartHandle(item.id)}
                      />
                    </Vrow>
                  </View>
                </Card>
              )}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {dataBanner.slice(0, 10).map((_, index) => (
            <View
              key={index}
              style={{
                width: 20,
                height: 10,
                borderRadius: 5,
                margin: 5,
                backgroundColor: index === activeIndex ? "red" : "gray",
              }}
            />
          ))}
        </View>
        <View>
          <Vrow justifyContent="space-between" align="center">
            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              Trending Now
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("More", {
                  movieId: "trending",
                  isTvSeries: false,
                })
              }
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 20,
                  fontFamily: "Montserrat_400Regular",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </Vrow>
        </View>
        <View>
          <Vrow>
            {loading == false ? (
              <FlatList
                horizontal
                data={dataFetch.trending}
                renderItem={({ item }) => (
                  <Card
                    onPress={() =>
                      navigation.navigate("detail", { movieId: item.id })
                    }
                    style={{
                      margin: 10,
                      width: 160,
                      overflow: "hidden",
                      borderColor: "white",
                      borderWidth: 0.5,
                    }}
                  >
                    <Card.Cover
                      style={{ borderRadius: 0 }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      height={250}
                    />
                  </Card>
                )}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "black",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"red"} />
              </View>
            )}
          </Vrow>
        </View>
        <View>
          <Vrow justifyContent="space-between" align="center">
            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              Top Rated Movies
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("More", {
                  movieId: "toprated",
                  isTvSeries: false,
                })
              }
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 20,
                  fontFamily: "Montserrat_400Regular",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </Vrow>
        </View>
        <View>
          <Vrow>
            {loading == false ? (
              <FlatList
                horizontal
                data={dataFetch.toprated}
                renderItem={({ item }) => (
                  <Card
                    onPress={() =>
                      navigation.navigate("detail", { movieId: item.id })
                    }
                    style={{
                      margin: 10,
                      width: 160,
                      overflow: "hidden",
                      borderColor: "white",
                      borderWidth: 0.5,
                    }}
                  >
                    <Card.Cover
                      style={{ borderRadius: 0 }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      height={250}
                    />
                  </Card>
                )}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "black",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"red"} />
              </View>
            )}
          </Vrow>
        </View>
        <View>
          <Vrow justifyContent="space-between" align="center">
            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              Tv Series On the Air
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("More", {
                  movieId: "tvSeriesList",
                  isTvSeries: true,
                })
              }
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 20,
                  fontFamily: "Montserrat_400Regular",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </Vrow>
        </View>
        <View>
          <Vrow>
            {loading == false ? (
              <FlatList
                horizontal
                data={dataFetch.tvSeriesList}
                renderItem={({ item }) => (
                  <Card
                    onPress={() =>
                      navigation.navigate("detail", {
                        movieId: item.id,
                        isTvSeries: true,
                      })
                    }
                    style={{
                      margin: 10,
                      width: 160,
                      overflow: "hidden",
                      borderColor: "white",
                      borderWidth: 0.5,
                    }}
                  >
                    <Card.Cover
                      style={{ borderRadius: 0 }}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      height={250}
                    />
                  </Card>
                )}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "black",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"red"} />
              </View>
            )}
          </Vrow>
        </View>
      </Container>
    </ScrollView>
  );
}
