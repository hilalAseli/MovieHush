import React, { useEffect, useRef, useState } from "react";
import Container from "../component/Container";
import Vrow from "../component/Vrow";
import axios from "axios";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, IconButton, Searchbar } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [dataFetch, setDataFetch] = useState({});

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
  useEffect(() => {
    fetchPopularMovies();
  }, []);
  return (
    <ScrollView>
      <Container bgColor="black">
        <View style={{ marginTop: 25 }}>
          <Vrow justifyContent="space-between" align="center">
            <TouchableOpacity
              onPress={() => navigation.navigate("menuaccount")}
            >
              <View>
                <Image
                  source={{ uri: user.imageUrl }}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 99,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
              </View>
            </TouchableOpacity>
            <Image
              source={require("../assets/logggo.jpg")}
              style={{
                width: 60,
                height: 60,
                borderRadius: 99,
                backgroundColor: "gray",
              }}
            />
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
                <ActivityIndicator size={"large"} color={"tomato"} />
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
                <ActivityIndicator size={"large"} color={"tomato"} />
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
                <ActivityIndicator size={"large"} color={"tomato"} />
              </View>
            )}
          </Vrow>
        </View>
      </Container>
    </ScrollView>
  );
}
