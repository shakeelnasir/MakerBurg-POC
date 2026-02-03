import React from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Pill } from "@/components/Pill";
import { SaveButton } from "@/components/SaveButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Opportunity } from "@shared/schema";

type OpportunityDetailRouteProp = RouteProp<RootStackParamList, "OpportunityDetail">;

export default function OpportunityDetailScreen() {
  const route = useRoute<OpportunityDetailRouteProp>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[isDark ? "dark" : "light"];

  const { data: opportunity, isLoading } = useQuery<Opportunity>({
    queryKey: ["/api/opportunities", route.params.id],
  });

  const handleApply = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (isLoading || !opportunity) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing["3xl"] }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Pill label={opportunity.category} variant="category" />
          <SaveButton item={{ kind: "opportunity", id: opportunity.id }} />
        </View>

        <ThemedText type="h1" style={styles.title}>
          {opportunity.title}
        </ThemedText>

        <ThemedText type="body" style={[styles.forLine, { color: colors.textSecondary }]}>
          {opportunity.forLine}
        </ThemedText>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={16} color={colors.textSecondary} />
            <ThemedText type="small" style={[styles.metaText, { color: colors.textSecondary }]}>
              Deadline: {opportunity.deadline}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Feather name="globe" size={16} color={colors.textSecondary} />
            <ThemedText type="small" style={[styles.metaText, { color: colors.textSecondary }]}>
              {opportunity.region}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            About
          </ThemedText>
          <ThemedText type="body" style={styles.sectionText}>
            {opportunity.about}
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Who can apply
          </ThemedText>
          {opportunity.who.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.bullet, { backgroundColor: theme.accent }]} />
              <ThemedText type="body">{item}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            What's offered
          </ThemedText>
          {opportunity.offer.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Feather name="check" size={18} color={theme.accent} />
              <ThemedText type="body" style={{ marginLeft: Spacing.sm }}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleApply}
          style={({ pressed }) => [
            styles.applyButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText
            type="body"
            style={[styles.applyButtonText, { color: isDark ? "#1A1816" : "#FFFFFF" }]}
          >
            {opportunity.linkLabel}
          </ThemedText>
          <Feather name="external-link" size={18} color={isDark ? "#1A1816" : "#FFFFFF"} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.pageMargin,
    paddingTop: Spacing["3xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  forLine: {
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: Spacing.xs,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  sectionText: {
    lineHeight: 26,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.md,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  applyButtonText: {
    fontWeight: "600",
  },
});
