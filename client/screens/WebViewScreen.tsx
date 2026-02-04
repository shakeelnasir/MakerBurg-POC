import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useTheme } from "@/hooks/useTheme";

type WebViewScreenRouteProp = RouteProp<RootStackParamList, "WebView">;

export default function WebViewScreen() {
  const route = useRoute<WebViewScreenRouteProp>();
  const { theme } = useTheme();
  const { url } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
