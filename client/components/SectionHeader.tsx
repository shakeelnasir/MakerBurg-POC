import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing } from "@/constants/theme";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];

  return (
    <View style={styles.container}>
      <ThemedText type="h3">{title}</ThemedText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}
          hitSlop={12}
        >
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {actionLabel}
          </ThemedText>
          <Feather
            name="chevron-right"
            size={16}
            color={colors.textSecondary}
            style={styles.actionIcon}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginLeft: Spacing.xs,
  },
});
