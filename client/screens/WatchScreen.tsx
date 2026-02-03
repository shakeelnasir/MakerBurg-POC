import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { VideoCard } from "@/components/VideoCard";
import { SAMPLE_VIDEOS } from "@/data/sampleData";
import { ThemedText } from "@/components/ThemedText";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WatchScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={SAMPLE_VIDEOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard 
            video={item} 
            onPress={() => navigation.navigate("WebView", { url: item.srcLink, title: item.title })} 
          />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        ListHeaderComponent={() => (
          <ThemedText type="h1" style={{ marginBottom: Spacing.lg }}>Watch</ThemedText>
        )}
      />
    </View>
  );
}
