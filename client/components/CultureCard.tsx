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
import { CultureEntry } from "@/data/sampleData";

interface CultureCardProps {
  entry: CultureEntry;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CultureCard({ entry, onPress }: CultureCardProps) {
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
      <Image
        source={{ uri: entry.hero }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.pills}>
          <Pill label={entry.region} />
          <Pill label={entry.craft} style={{ marginLeft: Spacing.sm }} />
        </View>
        <ThemedText type="h4" style={styles.title}>
          {entry.title}
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.intro, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {entry.intro}
        </ThemedText>
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
    height: 180,
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
  intro: {},
});
