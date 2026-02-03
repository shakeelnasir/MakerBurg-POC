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
import type { Story } from "@shared/schema";

type StoryDetailRouteProp = RouteProp<RootStackParamList, "StoryDetail">;

export default function StoryDetailScreen() {
  const route = useRoute<StoryDetailRouteProp>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[isDark ? "dark" : "light"];

  const { data: story, isLoading } = useQuery<Story>({
    queryKey: ["/api/stories", route.params.id],
  });

  if (isLoading || !story) {
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
        source={{ uri: story.hero }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.pills}>
            <Pill label={story.region} />
            <Pill label={story.craft} style={{ marginLeft: Spacing.sm }} />
          </View>
          <SaveButton item={{ kind: "story", id: story.id }} />
        </View>

        <ThemedText type="h1" style={styles.title}>
          {story.title}
        </ThemedText>

        <ThemedText type="body" style={[styles.subtitle, { color: colors.textSecondary }]}>
          {story.subtitle}
        </ThemedText>

        <ThemedText type="caption" style={[styles.readTime, { color: colors.textSecondary }]}>
          {story.readTime}
        </ThemedText>

        {story.body.map((paragraph, index) => (
          <ThemedText key={index} type="body" style={styles.paragraph}>
            {paragraph}
          </ThemedText>
        ))}

        {story.inlineImage ? (
          <Image
            source={{ uri: story.inlineImage }}
            style={styles.inlineImage}
            contentFit="cover"
            transition={300}
          />
        ) : null}

        {story.cultureLinks && story.cultureLinks.length > 0 ? (
          <View style={[styles.linksSection, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="h4" style={styles.linksTitle}>
              Related
            </ThemedText>
            {story.cultureLinks.map((link, index) => (
              <View key={index} style={styles.linkRow}>
                <ThemedText type="small" style={{ color: colors.textSecondary }}>
                  {link.label}
                </ThemedText>
                <ThemedText type="body">{link.value}</ThemedText>
              </View>
            ))}
          </View>
        ) : null}
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
    height: 320,
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  readTime: {
    marginBottom: Spacing["2xl"],
  },
  paragraph: {
    marginBottom: Spacing.xl,
    lineHeight: 28,
  },
  inlineImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginVertical: Spacing.xl,
  },
  linksSection: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginTop: Spacing.xl,
  },
  linksTitle: {
    marginBottom: Spacing.md,
  },
  linkRow: {
    paddingVertical: Spacing.sm,
  },
});
