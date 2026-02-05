import React from "react";
import { FlatList, View, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { StoryCard } from "@/components/StoryCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { VideoCard } from "@/components/VideoCard";
import { CultureCard } from "@/components/CultureCard";
import { HeaderTitle } from "@/components/HeaderTitle";
import { SectionHeader } from "@/components/SectionHeader";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Story, Opportunity, Video, CultureEntry } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { data: stories, isLoading: storiesLoading, refetch: refetchStories } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });
  const { data: opportunities, refetch: refetchOpportunities } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });
  const { data: videos, refetch: refetchVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });
  const { data: culture, refetch: refetchCulture } = useQuery<CultureEntry[]>({
    queryKey: ["/api/culture"],
  });

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStories(), refetchOpportunities(), refetchVideos(), refetchCulture()]);
    setIsRefreshing(false);
  };

  if (storiesLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundRoot, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }

  const sections = [
    { type: 'header', data: null },
    { type: 'hero', data: stories?.[0] },
    { type: 'section', title: "Editor's Picks", data: stories?.slice(1, 3) || [] },
    { type: 'section', title: "Opportunity Highlight", data: opportunities?.slice(0, 1) || [] },
    { type: 'section', title: "Recent Watch", data: videos?.slice(0, 1) || [] },
    { type: 'section', title: "From the Culture Atlas", data: culture?.slice(0, 1) || [] },
  ];

  const handlePress = (item: any, type?: string) => {
    if (type === 'culture') {
      navigation.navigate("CultureDetail", { entry: item });
    } else if (item.srcLink) {
      navigation.navigate("WebView", { url: item.srcLink, title: item.title });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <HeaderTitle title="Today" />;
      case 'hero':
        return item.data ? (
          <View style={styles.section}>
            <StoryCard story={item.data} onPress={() => handlePress(item.data)} variant="hero" />
          </View>
        ) : null;
      case 'section':
        return (
          <View style={styles.section}>
            <SectionHeader title={item.title} />
            {item.data.map((entry: any) => {
              if (item.title.includes('Pick') || item.title.includes('Story')) return <StoryCard key={entry.id} story={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Opp')) return <OpportunityCard key={entry.id} opportunity={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Watch')) return <VideoCard key={entry.id} video={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Culture')) return <CultureCard key={entry.id} entry={entry} onPress={() => handlePress(entry, 'culture')} />;
              return null;
            })}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={sections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.textPrimary} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
});
