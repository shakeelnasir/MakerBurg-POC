import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import StoryDetailScreen from "@/screens/StoryDetailScreen";
import OpportunityDetailScreen from "@/screens/OpportunityDetailScreen";
import VideoDetailScreen from "@/screens/VideoDetailScreen";
import CultureDetailScreen from "@/screens/CultureDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  StoryDetail: { id: string };
  OpportunityDetail: { id: string };
  VideoDetail: { id: string };
  CultureDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="OpportunityDetail"
        component={OpportunityDetailScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="CultureDetail"
        component={CultureDetailScreen}
        options={{ headerTitle: "" }}
      />
    </Stack.Navigator>
  );
}
