import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { CultureCard } from "@/components/CultureCard";
import { SAMPLE_CULTURE } from "@/data/sampleData";
import { ThemedText } from "@/components/ThemedText";

export default function CultureScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={SAMPLE_CULTURE}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CultureCard entry={item} onPress={() => {}} />}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        ListHeaderComponent={() => (
          <ThemedText type="h1" style={{ marginBottom: Spacing.lg }}>Culture Atlas</ThemedText>
        )}
      />
    </View>
  );
}
