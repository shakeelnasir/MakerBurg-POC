import React from "react";
import { View, ScrollView, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { StoryCard } from "@/components/StoryCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { VideoCard } from "@/components/VideoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Story, Opportunity, Video } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { data: stories = [], isLoading: loadingStories, refetch: refetchStories } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const { data: opportunities = [], isLoading: loadingOpps, refetch: refetchOpps } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const { data: videos = [], isLoading: loadingVideos, refetch: refetchVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const isLoading = loadingStories || loadingOpps || loadingVideos;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStories(), refetchOpps(), refetchVideos()]);
    setRefreshing(false);
  };

  const heroStory = stories[0];
  const recentStories = stories.slice(1, 4);
  const featuredOpps = opportunities.slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing["2xl"],
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <View>
            <ThemedText type="h2">Makerburg</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Discover craft traditions
            </ThemedText>
          </View>
        </View>
      </View>

      {heroStory ? (
        <View style={styles.section}>
          <SectionHeader title="Today" />
          <StoryCard
            story={heroStory}
            variant="hero"
            onPress={() => navigation.navigate("StoryDetail", { id: heroStory.id })}
          />
        </View>
      ) : null}

      {recentStories.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Recent Stories"
            actionLabel="See all"
            onAction={() => navigation.navigate("Main", { screen: "StoriesTab" } as never)}
          />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentStories}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <StoryCard
                story={item}
                variant="compact"
                onPress={() => navigation.navigate("StoryDetail", { id: item.id })}
              />
            )}
          />
        </View>
      ) : null}

      {featuredOpps.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Opportunities"
            actionLabel="See all"
            onAction={() => navigation.navigate("Main", { screen: "OpportunitiesTab" } as never)}
          />
          {featuredOpps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onPress={() => navigation.navigate("OpportunityDetail", { id: opp.id })}
            />
          ))}
        </View>
      ) : null}

      {videos.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Watch"
            actionLabel="See all"
            onAction={() => navigation.navigate("Main", { screen: "WatchTab" } as never)}
          />
          <VideoCard
            video={videos[0]}
            onPress={() => navigation.navigate("VideoDetail", { id: videos[0].id })}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.pageMargin,
    marginBottom: Spacing.lg,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
  },
  section: {
    paddingHorizontal: Spacing.pageMargin,
  },
  horizontalList: {
    paddingRight: Spacing.pageMargin,
  },
});
