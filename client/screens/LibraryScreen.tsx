import React from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { SAMPLE_STORIES, SAMPLE_OPPS, SAMPLE_VIDEOS, SAMPLE_CULTURE } from "@/data/sampleData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];
  const navigation = useNavigation<NavigationProp>();
  const { saved, loggedIn, setShowLoginModal } = useApp();

  const savedItems = saved.items
    .map((item) => {
      if (item.kind === "story") {
        const story = SAMPLE_STORIES.find((s) => s.id === item.id);
        return story ? { kind: "story" as const, data: story } : null;
      }
      if (item.kind === "opportunity") {
        const opp = SAMPLE_OPPS.find((o) => o.id === item.id);
        return opp ? { kind: "opportunity" as const, data: opp } : null;
      }
      if (item.kind === "video") {
        const video = SAMPLE_VIDEOS.find((v) => v.id === item.id);
        return video ? { kind: "video" as const, data: video } : null;
      }
      if (item.kind === "culture") {
        const entry = SAMPLE_CULTURE.find((c) => c.id === item.id);
        return entry ? { kind: "culture" as const, data: entry } : null;
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const handleItemPress = (item: typeof savedItems[0]) => {
    if (!item) return;
    if (item.kind === "story" || item.kind === "opportunity" || item.kind === "video") {
      navigation.navigate("WebView", { url: item.data.srcLink, title: item.data.title });
    } else if (item.kind === "culture") {
      navigation.navigate("CultureDetail", { entry: item.data });
    }
  };

  const getIcon = (kind: string) => {
    switch (kind) {
      case "story":
        return "book-open";
      case "opportunity":
        return "award";
      case "video":
        return "play-circle";
      case "culture":
        return "globe";
      default:
        return "bookmark";
    }
  };

  const getKindLabel = (kind: string) => {
    switch (kind) {
      case "story":
        return "Story";
      case "opportunity":
        return "Opportunity";
      case "video":
        return "Video";
      case "culture":
        return "Culture";
      default:
        return "";
    }
  };

  if (!loggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText type="h2" style={styles.emptyTitle}>Sign in to save items</ThemedText>
        <ThemedText type="body" style={styles.emptySubtitle}>Your saved stories, opportunities, and more will appear here</ThemedText>
        <Pressable
          onPress={() => setShowLoginModal(true)}
          style={({ pressed }) => [
            styles.signInButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText
            type="body"
            style={[styles.signInText, { color: isDark ? "#1A1816" : "#FFFFFF" }]}
          >
            Sign in
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: insets.top + Spacing.xl,
        paddingBottom: 100,
        paddingHorizontal: Spacing.lg,
        flexGrow: 1,
      }}
      data={savedItems}
      keyExtractor={(item, index) => `${item?.kind}-${item?.data.id}-${index}`}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText type="h2" style={styles.emptyTitle}>Nothing saved yet</ThemedText>
          <ThemedText type="body" style={styles.emptySubtitle}>Tap the bookmark icon on any content to save it here</ThemedText>
        </View>
      }
      renderItem={({ item }) =>
        item ? (
          <Pressable
            onPress={() => handleItemPress(item)}
            style={({ pressed }) => [
              styles.savedItem,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
              <Feather name={getIcon(item.kind)} size={20} color={theme.accent} />
            </View>
            <View style={styles.itemContent}>
              <ThemedText type="small" style={{ color: colors.textSecondary }}>
                {getKindLabel(item.kind)}
              </ThemedText>
              <ThemedText type="body" numberOfLines={2}>
                {item.data.title}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  signInButton: {
    paddingHorizontal: Spacing["2xl"],
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  signInText: {
    fontWeight: "600",
  },
  savedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
  },
});
