import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Container from "../component/Container";
import { useUser } from "@clerk/clerk-expo";
import Vcol from "../component/Vcol";
import Vrow from "../component/Vrow";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

export default function MenuAccount() {
  const { user } = useUser();
  const navigation = useNavigation();

  return (
    <Container bgColor="black">
      <View>
        <IconButton
          icon={"arrow-left"}
          iconColor="white"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Vcol>
        <View style={{ alignItems: "center", marginTop: 70, gap: 10 }}>
          <Image
            source={{ uri: user.imageUrl }}
            style={{
              height: 100,
              width: 100,
              borderRadius: 99,
              borderWidth: 2,
              borderColor: "white",
            }}
          />
          <Text style={{ color: "white", fontFamily: "Poppins_400Regular" }}>
            {user.fullName}
          </Text>
        </View>
      </Vcol>
    </Container>
  );
}
