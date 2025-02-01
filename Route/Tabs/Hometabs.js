import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/Home";
import Favorites from "../../menuAccount/Favorites";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

export default function Hometabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "rgba(0,0, 0, 0.8)",
          height: 70,
          position: "absolute",
        },
        tabBarItemStyle: {
          padding: 15,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? "home" : "home"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="favoritesMenu"
        component={Favorites}
        options={{
          tabBarIcon: ({  size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={"bookmark"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
