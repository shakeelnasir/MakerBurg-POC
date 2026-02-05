import React from "react";
import { FlatList, View, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ThemedText } from "@/components/ThemedText";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Opportunity } from "@shared/schema";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OpportunitiesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { data: opportunities, isLoading, refetch, isRefetching } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundRoot, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={opportunities || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpportunityCard 
            opportunity={item} 
            onPress={() => navigation.navigate("WebView", { url: item.srcLink || "", title: item.title })} 
          />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        ListHeaderComponent={() => (
          <ThemedText type="h1" style={{ marginBottom: Spacing.lg }}>Opportunities</ThemedText>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.textPrimary} />
        }
      />
    </View>
  );
}
