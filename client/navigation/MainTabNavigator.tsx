import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import StoriesScreen from "@/screens/StoriesScreen";
import OpportunitiesScreen from "@/screens/OpportunitiesScreen";
import WatchScreen from "@/screens/WatchScreen";
import CultureScreen from "@/screens/CultureScreen";

export type MainTabParamList = {
  HomeTab: undefined;
  StoriesTab: undefined;
  OpportunitiesTab: undefined;
  WatchTab: undefined;
  CultureTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StoriesTab"
        component={StoriesScreen}
        options={{
          title: "Stories",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OpportunitiesTab"
        component={OpportunitiesScreen}
        options={{
          title: "Opps",
          tabBarIcon: ({ color, size }) => (
            <Feather name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchTab"
        component={WatchScreen}
        options={{
          title: "Watch",
          tabBarIcon: ({ color, size }) => (
            <Feather name="play" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CultureTab"
        component={CultureScreen}
        options={{
          title: "Culture",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
