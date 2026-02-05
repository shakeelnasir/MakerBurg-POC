import React from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { StoryCard } from "@/components/StoryCard";
import { ThemedText } from "@/components/ThemedText";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Story } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StoriesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const {
    data: stories,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.backgroundRoot,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.backgroundRoot,
          justifyContent: "center",
          alignItems: "center",
          padding: Spacing.xl,
        }}
      >
        <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
          Error loading stories
        </ThemedText>
        <ThemedText type="body" style={{ textAlign: "center", marginBottom: Spacing.lg }}>
          {error.message}
        </ThemedText>
        <Pressable onPress={() => refetch()} style={{ padding: Spacing.md }}>
          <ThemedText type="body" style={{ color: theme.textPrimary }}>
            Tap to retry
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={stories || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryCard
            story={item}
            onPress={() =>
              navigation.navigate("WebView", {
                url: item.srcLink || "",
                title: item.title,
              })
            }
          />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        ListHeaderComponent={() => (
          <ThemedText type="h1" style={{ marginBottom: Spacing.lg }}>
            Stories
          </ThemedText>
        )}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ThemedText type="body">No stories found</ThemedText>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.textPrimary}
          />
        }
      />
    </View>
  );
}
