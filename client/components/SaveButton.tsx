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
        name={saved ? "bookmark" : "bookmark"}
        size={size}
        color={iconColor}
        style={{ opacity: saved ? 1 : 0.7 }}
      />
      {saved ? (
        <Feather
          name="check"
          size={12}
          color={iconColor}
          style={styles.checkIcon}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    padding: 4,
  },
  checkIcon: {
    position: "absolute",
    bottom: 2,
    right: 0,
  },
});
