import React from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { SaveButton } from "@/components/SaveButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { CultureEntry } from "@shared/schema";

type CultureDetailRouteProp = RouteProp<RootStackParamList, "CultureDetail">;

export default function CultureDetailScreen() {
  const route = useRoute<CultureDetailRouteProp>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[isDark ? "dark" : "light"];

  const { data: entry, isLoading } = useQuery<CultureEntry>({
    queryKey: ["/api/culture", route.params.id],
  });

  if (isLoading || !entry) {
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
      <Image
        source={{ uri: entry.hero }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.pills}>
            <Pill label={entry.region} />
            <Pill label={entry.craft} style={{ marginLeft: Spacing.sm }} />
          </View>
          <SaveButton item={{ kind: "culture", id: entry.id }} />
        </View>

        <ThemedText type="h1" style={styles.title}>
          {entry.title}
        </ThemedText>

        <ThemedText type="body" style={styles.intro}>
          {entry.intro}
        </ThemedText>

        {entry.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <ThemedText type="h3" style={styles.sectionHeader}>
              {section.h}
            </ThemedText>
            <ThemedText type="body" style={styles.sectionText}>
              {section.p}
            </ThemedText>
          </View>
        ))}
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
  heroImage: {
    width: "100%",
    height: 300,
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
  intro: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: Spacing["2xl"],
    opacity: 0.9,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionText: {
    lineHeight: 26,
  },
});
