import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
    login,
    register,
    pendingSaveItem,
    setPendingSaveItem,
    toggleSave,
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = Colors[isDark ? "dark" : "light"];

  useEffect(() => {
    if (!showLoginModal) {
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
      setIsRegister(false);
    }
  }, [showLoginModal]);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }
    setLoading(true);
    const result = isRegister
      ? await register(email, password)
      : await login(email, password);
    setLoading(false);
    if (result.ok) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (pendingSaveItem) {
        toggleSave(pendingSaveItem);
        setPendingSaveItem(null);
      }
      setShowLoginModal(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error || "Something went wrong");
    }
  };

  const handleClose = () => {
    setPendingSaveItem(null);
    setShowLoginModal(false);
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
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
            {isRegister ? "Create Account" : "Welcome Back"}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {isRegister
              ? "Sign up to save your bookmarks"
              : "Sign in to access your library"}
          </ThemedText>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: isDark ? "rgba(220,60,60,0.15)" : "rgba(220,60,60,0.08)" }]}>
              <ThemedText type="caption" style={styles.errorText}>
                {error}
              </ThemedText>
            </View>
          ) : null}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
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
            autoComplete="email"
            testID="input-email"
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={isRegister ? "Password (min 6 characters)" : "Password"}
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={isRegister ? "new-password" : "current-password"}
            testID="input-password"
          />

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: theme.accent, opacity: pressed || loading ? 0.7 : 1 },
            ]}
            testID="button-submit"
          >
            {loading ? (
              <ActivityIndicator color={isDark ? "#1A1816" : "#FFFFFF"} size="small" />
            ) : (
              <ThemedText
                type="body"
                style={[styles.primaryBtnText, { color: isDark ? "#1A1816" : "#FFFFFF" }]}
              >
                {isRegister ? "Create Account" : "Sign In"}
              </ThemedText>
            )}
          </Pressable>

          <Pressable onPress={toggleMode} style={styles.toggleBtn}>
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <ThemedText type="caption" style={{ color: theme.accent }}>
                {isRegister ? "Sign In" : "Sign Up"}
              </ThemedText>
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
  errorBox: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: "#DC3C3C",
    textAlign: "center",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  primaryBtn: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  primaryBtnText: {
    fontWeight: "600",
  },
  toggleBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  secondaryBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
