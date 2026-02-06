import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";
import { useApp, SavedItem } from "@/context/AppContext";

interface SaveButtonProps {
  item: SavedItem;
  size?: number;
  color?: string;
}

export function SaveButton({ item, size = 22, color }: SaveButtonProps) {
  const { theme } = useTheme();
  const { loggedIn, isSaved, toggleSave, setShowLoginModal, setPendingSaveItem } = useApp();
  
  const saved = isSaved(item);
  const iconColor = color || theme.text;

  const handlePress = async () => {
    if (!loggedIn) {
      setPendingSaveItem(item);
      setShowLoginModal(true);
      return;
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSave(item);
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Feather
        name="bookmark"
        size={size}
        color={saved ? theme.accent : iconColor}
        style={{ opacity: saved ? 1 : 0.5 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    padding: 4,
  },
});
