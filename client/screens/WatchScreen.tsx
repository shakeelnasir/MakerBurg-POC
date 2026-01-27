import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { VideoCard } from "@/components/VideoCard";
import { SAMPLE_VIDEOS } from "@/data/sampleData";
import { ThemedText } from "@/components/ThemedText";

export default function WatchScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={SAMPLE_VIDEOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} onPress={() => {}} />}
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
