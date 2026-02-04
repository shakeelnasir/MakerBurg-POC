import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CultureEntry } from "@/data/sampleData";

type CultureDetailScreenRouteProp = RouteProp<RootStackParamList, "CultureDetail">;

export default function CultureDetailScreen() {
  const route = useRoute<CultureDetailScreenRouteProp>();
  const { theme, isDark } = useTheme();
  const { entry } = route.params;

  if (!entry) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <Image
        source={{ uri: entry.hero }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.pills}>
          <Pill label={entry.region} />
          <Pill label={entry.craft} style={{ marginLeft: Spacing.sm }} />
        </View>
        
        <ThemedText type="h1" style={styles.title}>
          {entry.title}
        </ThemedText>
        
        <ThemedText type="body" style={styles.intro}>
          {entry.intro}
        </ThemedText>

        {entry.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <ThemedText type="h3" style={styles.sectionHeader}>
              {section.h}
            </ThemedText>
            <ThemedText type="body" style={styles.sectionText}>
              {section.p}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  pills: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  intro: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: Spacing["2xl"],
    opacity: 0.9,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionText: {
    lineHeight: 24,
  },
});
