import React from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { SaveButton } from "@/components/SaveButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Video } from "@shared/schema";

type VideoDetailRouteProp = RouteProp<RootStackParamList, "VideoDetail">;

export default function VideoDetailScreen() {
  const route = useRoute<VideoDetailRouteProp>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[isDark ? "dark" : "light"];

  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ["/api/videos", route.params.id],
  });

  const handlePlay = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (isLoading || !video) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing["3xl"] }}
    >
      <Pressable onPress={handlePlay} style={styles.videoContainer}>
        <Image
          source={{ uri: video.thumb }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Feather name="play" size={32} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.duration}>
          <ThemedText style={styles.durationText}>{video.duration}</ThemedText>
        </View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.pills}>
            <Pill label={video.region} />
            <Pill label={video.craft} style={{ marginLeft: Spacing.sm }} />
          </View>
          <SaveButton item={{ kind: "video", id: video.id }} />
        </View>

        <ThemedText type="h1" style={styles.title}>
          {video.title}
        </ThemedText>

        <ThemedText type="body" style={[styles.description, { color: colors.textSecondary }]}>
          {video.description}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  duration: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    padding: Spacing.pageMargin,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  pills: {
    flexDirection: "row",
  },
  title: {
    marginBottom: Spacing.lg,
  },
  description: {
    lineHeight: 26,
  },
});
