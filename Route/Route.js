import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Login from "../screens/Login";
import { tokenCache } from "../hooks/TokenCache";
import MenuAccount from "../menuAccount/MenuAccount";
import Favorites from "../menuAccount/Favorites";
import Detail from '../detailScreen/[detail]'
import Hometabs from "./Tabs/Hometabs";
import More from "../MoreCompleteChoices/MorePage";
const Stack = createStackNavigator();
export default function Route() {
  const Linking = {
    prefixes: ["MovieHush://"],
    config: {
      screens: {
        Home: "Home",
        Login: "Login",
      },
    },
  };
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <NavigationContainer linking={Linking}>
        <SignedIn>
          <Stack.Navigator>
            <Stack.Screen
              name="Hometabs"
              component={Hometabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="detail"
              component={Detail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="menuaccount"
              component={MenuAccount}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="favoritesMenu"
              component={Favorites}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="More"
              component={More}
              options={{headerShown:false}}
            />
          </Stack.Navigator>
        </SignedIn>
        <SignedOut>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </SignedOut>
      </NavigationContainer>
    </ClerkProvider>
  );
}
