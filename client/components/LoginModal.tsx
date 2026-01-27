import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export function LoginModal() {
  const { theme, isDark } = useTheme();
  const {
    showLoginModal,
    setShowLoginModal,
    setLoggedIn,
    pendingSaveItem,
    setPendingSaveItem,
    toggleSave,
  } = useApp();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!showLoginModal) {
      setEmail("");
    }
  }, [showLoginModal]);

  const handleLogin = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoggedIn(true);
    if (pendingSaveItem) {
      toggleSave(pendingSaveItem);
      setPendingSaveItem(null);
    }
    setShowLoginModal(false);
  };

  const handleClose = () => {
    setPendingSaveItem(null);
    setShowLoginModal(false);
  };

  return (
    <Modal visible={showLoginModal} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={40}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.5)" },
              ]}
            />
          )}
        </Pressable>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <ThemedText type="h3" style={styles.title}>
            Save to your Library
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: Colors[isDark ? "dark" : "light"].textSecondary }]}
          >
            Optional login — only needed to save bookmarks.
          </ThemedText>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email (optional for demo)"
            placeholderTextColor={Colors[isDark ? "dark" : "light"].textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <ThemedText
              type="body"
              style={[styles.primaryBtnText, { color: isDark ? "#1A1816" : "#FFFFFF" }]}
            >
              Sign in & Continue
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Not now
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "85%",
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing["3xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  primaryBtn: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  primaryBtnText: {
    fontWeight: "600",
  },
  secondaryBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
