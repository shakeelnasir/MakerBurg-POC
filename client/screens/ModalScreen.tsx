import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

export default function ModalScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Feather name="x" size={24} color={theme.text} />
      </Pressable>
      <View style={styles.content}>
        <ThemedText type="h1">Modal Content</ThemedText>
        <ThemedText type="body">This is a modal screen.</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
    padding: Spacing.md,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});
