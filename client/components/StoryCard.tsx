import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
  onPress: () => void;
  variant?: "default" | "hero" | "compact";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryCard({ story, onPress, variant = "default" }: StoryCardProps) {
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

  const SourceBadge = () => (
    <View style={styles.sourceContainer}>
      <Image source={{ uri: story.srcFavIcon }} style={styles.sourceFavIcon} />
      <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 10 }}>
        {story.source}
      </ThemedText>
    </View>
  );

  if (variant === "hero") {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.heroContainer, animatedStyle]}
      >
        <Image
          source={{ uri: story.hero }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroPills}>
            <Pill label={story.region} />
            <Pill label={story.craft} style={{ marginLeft: Spacing.sm }} />
          </View>
          <ThemedText type="h2" style={styles.heroTitle}>
            {story.title}
          </ThemedText>
          <ThemedText type="body" style={styles.heroSubtitle}>
            {story.subtitle}
          </ThemedText>
          <View style={styles.heroSourceBadge}>
            <SourceBadge />
          </View>
        </View>
      </AnimatedPressable>
    );
  }

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
      <Image
        source={{ uri: story.hero }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.pills}>
          <Pill label={story.region} />
          <Pill label={story.craft} style={{ marginLeft: Spacing.sm }} />
        </View>
        <ThemedText type="h4" style={styles.title}>
          {story.title}
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {story.subtitle}
        </ThemedText>
        <View style={styles.cardFooter}>
          <ThemedText
            type="caption"
            style={[styles.readTime, { color: colors.textSecondary }]}
          >
            {story.readTime}
          </ThemedText>
          <SourceBadge />
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
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: Spacing.lg,
  },
  pills: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  readTime: {},
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceFavIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    borderRadius: 2,
  },
  heroContainer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    height: 360,
    marginBottom: Spacing.lg,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    padding: Spacing.xl,
  },
  heroPills: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  heroTitle: {
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    marginBottom: Spacing.sm,
  },
  heroSourceBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
