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
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { Opportunity } from "@/data/sampleData";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onPress: () => void;
  variant?: "default" | "highlight";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OpportunityCard({
  opportunity,
  onPress,
  variant = "default",
}: OpportunityCardProps) {
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
        {
          backgroundColor:
            variant === "highlight"
              ? theme.backgroundSecondary
              : theme.backgroundDefault,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <Pill label={opportunity.category} variant="category" />
        <View style={styles.deadline}>
          <Feather name="calendar" size={14} color={colors.textSecondary} />
          <ThemedText
            type="caption"
            style={[styles.deadlineText, { color: colors.textSecondary }]}
          >
            {opportunity.deadline}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="h4" style={styles.title}>
        {opportunity.title}
      </ThemedText>

      <ThemedText
        type="body"
        style={[styles.forLine, { color: colors.textSecondary }]}
      >
        {opportunity.forLine}
      </ThemedText>

      <View style={styles.footer}>
        <View style={styles.region}>
          <Feather name="globe" size={14} color={colors.textSecondary} />
          <ThemedText
            type="caption"
            style={[styles.regionText, { color: colors.textSecondary }]}
          >
            {opportunity.region}
          </ThemedText>
        </View>
        <View style={styles.sourceContainer}>
          <Image source={{ uri: opportunity.srcFavIcon }} style={styles.sourceFavIcon} />
          <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 10 }}>
            {opportunity.source}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  deadline: {
    flexDirection: "row",
    alignItems: "center",
  },
  deadlineText: {
    marginLeft: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  forLine: {
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  region: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionText: {
    marginLeft: Spacing.xs,
  },
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
});
