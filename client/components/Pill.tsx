import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface PillProps {
  label: string;
  style?: ViewStyle;
  variant?: "default" | "category";
}

export function Pill({ label, style, variant = "default" }: PillProps) {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];

  const backgroundColor = variant === "category" ? colors.accent : colors.pill;
  const textColor = variant === "category" 
    ? (isDark ? "#1A1816" : "#FFFFFF") 
    : colors.pillText;

  return (
    <View style={[styles.pill, { backgroundColor }, style]}>
      <ThemedText style={[styles.text, { color: textColor }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  text: {
    ...Typography.pill,
  },
});
