import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { StoryCard } from "@/components/StoryCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { VideoCard } from "@/components/VideoCard";
import { CultureCard } from "@/components/CultureCard";
import { HeaderTitle } from "@/components/HeaderTitle";
import { SectionHeader } from "@/components/SectionHeader";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { SAMPLE_STORIES, SAMPLE_OPPS, SAMPLE_VIDEOS, SAMPLE_CULTURE } from "@/data/sampleData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const sections = [
    { type: 'header', data: null },
    { type: 'hero', data: SAMPLE_STORIES[0] },
    { type: 'section', title: "Editor's Picks", data: SAMPLE_STORIES.slice(1, 3) },
    { type: 'section', title: "Opportunity Highlight", data: [SAMPLE_OPPS[0]] },
    { type: 'section', title: "Recent Watch", data: [SAMPLE_VIDEOS[0]] },
    { type: 'section', title: "From the Culture Atlas", data: [SAMPLE_CULTURE[0]] },
  ];

  const handlePress = (item: any) => {
    if (item.srcLink) {
      navigation.navigate("WebView", { url: item.srcLink, title: item.title });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <HeaderTitle title="Today" />;
      case 'hero':
        return (
          <View style={styles.section}>
            <StoryCard story={item.data} onPress={() => handlePress(item.data)} variant="hero" />
          </View>
        );
      case 'section':
        return (
          <View style={styles.section}>
            <SectionHeader title={item.title} />
            {item.data.map((entry: any) => {
              if (item.title.includes('Pick') || item.title.includes('Story')) return <StoryCard key={entry.id} story={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Opp')) return <OpportunityCard key={entry.id} opportunity={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Watch')) return <VideoCard key={entry.id} video={entry} onPress={() => handlePress(entry)} />;
              if (item.title.includes('Culture')) return <CultureCard key={entry.id} entry={entry} onPress={() => {}} />;
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
});
