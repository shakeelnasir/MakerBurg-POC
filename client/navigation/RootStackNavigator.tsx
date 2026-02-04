import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import ModalScreen from "@/screens/ModalScreen";
import WebViewScreen from "@/screens/WebViewScreen";
import CultureDetailScreen from "@/screens/CultureDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { CultureEntry } from "@/data/sampleData";

export type RootStackParamList = {
  Main: undefined;
  Modal: undefined;
  WebView: { url: string; title: string };
  CultureDetail: { entry: CultureEntry };
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
        name="Modal"
        component={ModalScreen}
        options={{
          presentation: "modal",
          headerTitle: "Modal",
        }}
      />
      <Stack.Screen
        name="WebView"
        component={WebViewScreen}
        options={({ route }) => ({
          headerTitle: route.params.title,
          headerBackTitle: "Back",
        })}
      />
      <Stack.Screen
        name="CultureDetail"
        component={CultureDetailScreen}
        options={({ route }) => ({
          headerTitle: route.params.entry?.title || "Culture",
          headerBackTitle: "Atlas",
        })}
      />
    </Stack.Navigator>
  );
}
