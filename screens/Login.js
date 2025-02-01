import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect } from "react";
import Container from "../component/Container";
import { IconButton } from "react-native-paper";
import useWarmUpBrowser from "../hooks/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/Hometabs", { scheme: "MovieHush" }),
      });
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("gagal bor");
      }
    } catch (err) {
      console.log(err, "invalid");
    }
  }, [startOAuthFlow]);

  return (
    <Container bgColor="black">
      <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: "red",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Petualangan epik menantimu.
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "white",
            marginBottom: 50,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Masuk dan mulai dan nikmati dunia film tak terbatas.
        </Text>
      </View>
      <View style={{alignItems:'center',justifyContent:'center'}}>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 300, height: 300 }}
        />
        {/* <Image
          source={require("../assets/Login.png")}
          style={{ width: 300, height: 300 }}
        /> */}
      </View>
      <View style={{ margin: 30 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <IconButton icon="movie-roll" iconColor="white" size={30} />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              left: 80,
            }}
          >
            Masuk
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
