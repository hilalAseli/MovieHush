import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Container from "../component/Container";
import { IconButton } from "react-native-paper";
import { WebView } from "react-native-webview";
import Vrow from "../component/Vrow";
import { useUser } from "@clerk/clerk-expo";
import Vcol from "../component/Vcol";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { Rating } from "react-native-ratings";
export default function Detail({ route }) {
  const { movieId, isTvSeries } = route.params;

  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailer] = useState(null);
  const [heart, setHeart] = useState(false);
  const [cast, setCast] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = "f1039e750b66732eb02758bb918b0190";
  const navigation = useNavigation();
  const { user } = useUser();

  const fetchMovieDetail = async () => {
    setLoading(true);
    try {
      const url = isTvSeries
        ? `https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}&language=en-US&page=1`
        : `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      const response = await axios.get(url);
      setMovieDetails(response.data);
      fetchTrailer();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const heartHandle = async () => {
    try {
      const favlist = await query(collection(db, "FavoriteList"));
      const snapshot = await getDocs(favlist);
      const alreadyData = snapshot.docs.some((item) => {
        const data = item.data();
        const { user_email, movieId } = data;
        return (
          user_email === user?.primaryEmailAddress.emailAddress &&
          movieId === movieDetails.id
        );
      });
      if (!alreadyData) {
        const docId = `${user.fullName}-${new Date().getTime()}`;
        await setDoc(doc(db, "FavoriteList", docId), {
          userAddItem: movieDetails,
          movieId: movieDetails.id,
          created_at: new Date().toISOString(),
          user_email: user?.primaryEmailAddress.emailAddress,
          user_name: user?.fullName,
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
      console.log(err, "failed add fav");
    }
  };

  const fetchCast = async () => {
    setLoading(true);
    try {
      const url = isTvSeries
        ? `https://api.themoviedb.org/3/tv/${movieId}/credits?api_key=${API_KEY}&language=en-US`
        : `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`;
      const response = await axios.get(url);
      setCast(response.data.cast.slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.log("err", err);
    }
  };

  const fetchTrailer = async () => {
    try {
      const url = isTvSeries
        ? `https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        : `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US&page=1`;

      const response = await axios.get(url);
      const trailerData = response.data.results.find(
        (video) => video.type === "Trailer"
      );
      if (trailerData) {
        setTrailer(trailerData.key);
      }
    } catch (err) {
      console.log(err, "error fetch movies");
    }
  };

  useEffect(() => {
    fetchMovieDetail();
    fetchCast();
  }, [movieId, isTvSeries]);

  if (!movieDetails || loading) {
    return (
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
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Container bgColor="black">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            zIndex: 10,
            width: "100%",
            padding: 20,
          }}
        >
          <IconButton
            icon={"arrow-left"}
            iconColor="white"
            style={{ backgroundColor: "gray" }}
            onPress={() => navigation.goBack()}
          />
          <IconButton
            icon={heart ? "bookmark" : "bookmark-outline"}
            iconColor={heart ? "white" : "white"}
            style={{ backgroundColor: "gray" }}
            onPress={heartHandle}
          />
        </View>
        <View
          style={{
            height: 300,
            width: "100%",
            marginTop: 50,
          }}
        >
          {trailerKey ? (
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&moodestbranding=1`,
              }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
            />
          ) : (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
              }}
              style={{ width: "100%", height: "100%", borderRadius: 5 }}
            />
          )}
        </View>
        <Vrow flexWrap="wrap">
          {movieDetails.genres.map((item) => (
            <Text
              style={{
                backgroundColor: "#444",
                color: "white",
                padding: 10,
                margin: 5,
                borderRadius: 5,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {item.name}
            </Text>
          ))}
        </Vrow>
        <Vcol padding="15px">
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontFamily: "Montserrat_700Bold",
            }}
          >
            Prolog
          </Text>
          {movieDetails.overview ? (
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                marginTop: 10,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {movieDetails.overview}
            </Text>
          ) : (
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                marginTop: 10,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Prolog Tidak Tersedia :(
            </Text>
          )}
        </Vcol>
        <Vrow padding="15px" align="center">
          <Rating
            type="star"
            imageSize={20}
            readonly
            startingValue={movieDetails.vote_average / 2}
            tintColor="black"
            ratingColor="gold"
            ratingBackgroundColor="gray"
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
            }}
          >
            {movieDetails.vote_average.toFixed(1)} / 10
          </Text>
        </Vrow>

        {isTvSeries ? (
          <Vrow justifyContent="space-between" padding="15px">
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Total episode: {movieDetails.last_episode_to_air.episode_number}
            </Text>
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Tanggal Rilis:{" "}
              {new Date(movieDetails.first_air_date).toLocaleDateString()}
            </Text>
          </Vrow>
        ) : (
          <Vrow justifyContent="space-between" padding="15px">
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Durasi: {Math.floor(movieDetails.runtime / 60)} jam{" "}
              {movieDetails.runtime % 60} menit
            </Text>
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
              }}
            >
              Tanggal Rilis:{" "}
              {new Date(movieDetails.release_date).toLocaleDateString()}
            </Text>
          </Vrow>
        )}

        <Vcol padding="15px">
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontFamily: "Montserrat_700Bold",
            }}
          >
            Top Cast
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Vrow paddingTop="10px">
              {cast && cast.length > 0 ? (
                cast.map((item) => (
                  <Vcol padding="10px" align="center" key={item.id}>
                    <Image
                      source={{
                        uri: item.profile_path
                          ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                          : "https://via.placeholder.com/100x150.png?text=No+Image",
                      }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 99,
                        margin: 5,
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins_500Medium",
                        fontSize: 16,
                        width: 100,
                        flexWrap: "wrap",
                        textAlign: "center",
                      }}
                    >
                      {item.character}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {item.original_name}
                    </Text>
                  </Vcol>
                ))
              ) : (
                <Text
                  style={{ color: "gray", fontFamily: "Poppins_400Regular" }}
                >
                  No cast available
                </Text>
              )}
            </Vrow>
          </ScrollView>
        </Vcol>
      </Container>
    </ScrollView>
  );
}
