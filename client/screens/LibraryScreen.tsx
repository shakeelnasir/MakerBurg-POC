import React from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Story, Opportunity, Video, CultureEntry } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];
  const navigation = useNavigation<NavigationProp>();
  const { saved, loggedIn, setShowLoginModal } = useApp();

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });
  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });
  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });
  const { data: culture = [] } = useQuery<CultureEntry[]>({
    queryKey: ["/api/culture"],
  });

  const savedItems = saved.items
    .map((item) => {
      if (item.kind === "story") {
        const story = stories.find((s) => s.id === item.id);
        return story ? { kind: "story" as const, data: story } : null;
      }
      if (item.kind === "opportunity") {
        const opp = opportunities.find((o) => o.id === item.id);
        return opp ? { kind: "opportunity" as const, data: opp } : null;
      }
      if (item.kind === "video") {
        const video = videos.find((v) => v.id === item.id);
        return video ? { kind: "video" as const, data: video } : null;
      }
      if (item.kind === "culture") {
        const entry = culture.find((c) => c.id === item.id);
        return entry ? { kind: "culture" as const, data: entry } : null;
      }
      return null;
    })
    .filter(Boolean);

  const handleItemPress = (item: typeof savedItems[0]) => {
    if (!item) return;
    if (item.kind === "story") {
      navigation.navigate("StoryDetail", { id: item.data.id });
    } else if (item.kind === "opportunity") {
      navigation.navigate("OpportunityDetail", { id: item.data.id });
    } else if (item.kind === "video") {
      navigation.navigate("VideoDetail", { id: item.data.id });
    } else if (item.kind === "culture") {
      navigation.navigate("CultureDetail", { id: item.data.id });
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
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
      >
        <EmptyState
          image={require("@/assets/images/empty-library.png")}
          title="Sign in to save items"
          subtitle="Your saved stories, opportunities, and more will appear here"
        />
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
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.pageMargin,
        flexGrow: 1,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={savedItems}
      keyExtractor={(item, index) => `${item?.kind}-${item?.data.id}-${index}`}
      ListEmptyComponent={
        <EmptyState
          image={require("@/assets/images/empty-library.png")}
          title="Nothing saved yet"
          subtitle="Tap the bookmark icon on any content to save it here"
        />
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
              <ThemedText type="caption" style={{ color: colors.textSecondary }}>
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
    paddingHorizontal: Spacing.pageMargin,
    alignItems: "center",
    justifyContent: "center",
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
