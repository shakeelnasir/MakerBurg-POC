import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { CultureCard } from "@/components/CultureCard";
import { SAMPLE_CULTURE } from "@/data/sampleData";
import { ThemedText } from "@/components/ThemedText";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CultureScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundRoot }}>
      <FlatList
        data={SAMPLE_CULTURE}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CultureCard 
            entry={item} 
            onPress={() => navigation.navigate("CultureDetail", { entry: item })} 
          />
        )}
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
