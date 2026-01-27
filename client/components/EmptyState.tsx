import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing } from "@/constants/theme";

interface EmptyStateProps {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
}

export function EmptyState({ image, title, subtitle }: EmptyStateProps) {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <ThemedText type="h4" style={styles.title}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing["5xl"],
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: Spacing["2xl"],
    opacity: 0.8,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
});
