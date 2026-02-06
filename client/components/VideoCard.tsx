import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { SaveButton } from "@/components/SaveButton";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function VideoCard({ video, onPress }: VideoCardProps) {
  const { theme, isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: video.thumb }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Feather name="play" size={24} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.duration}>
          <ThemedText style={styles.durationText}>{video.duration}</ThemedText>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.contentTopRow}>
          <View style={styles.pills}>
            <Pill label={video.region} />
            <Pill label={video.craft} style={{ marginLeft: Spacing.sm }} />
          </View>
          <SaveButton item={{ kind: "video", id: video.id }} size={20} />
        </View>
        <ThemedText type="h4" numberOfLines={2}>
          {video.title}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {video.description}
        </ThemedText>
        <View style={styles.sourceFooter}>
          <Image source={{ uri: video.srcFavIcon }} style={styles.sourceFavIcon} />
          <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 10 }}>
            {video.source}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },
  duration: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    padding: Spacing.lg,
  },
  contentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  pills: {
    flexDirection: "row",
    flex: 1,
  },
  description: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sourceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sourceFavIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    borderRadius: 2,
  },
});
