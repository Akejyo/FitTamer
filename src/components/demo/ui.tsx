import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname, type Href } from "expo-router";
import { Image } from "expo-image";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
export const c = {
  ink: "#E8EDF4", // main text
  muted: "#95A1B2", // secondary text
  green: "#5B9BEA", // blue accent (text, progress, markers)
  lime: "#1E3550", // blue highlight card
  cream: "#121821", // app background
  surface: "#1C2430", // cards, bottom bar
  tint: "#1A2A3E", // soft blue card
  line: "#2C3746", // borders
  peach: "#3A2A1C", // warm card
  orange: "#C4561D", // primary buttons
  orangeLight: "#4A2A17", // active tab
  mint: "#5FD08A", // green badge text
  mintBg: "#1A3A2A", // green badge background
  navy: "#A9C4FF", // dark blue badge text
  navyBg: "#1E3A8A", // dark blue badge background
  purple: "#D4B5FF", // purple badge text
  purpleBg: "#4A2A7A", // purple badge background
  yellowBg: "#3D3214", // yellow badge background
  orangeText: "#FF9A5C", // orange badge text
  yellow: "#F5C542", // selected pet border
};
export function Copy({
  children,
  muted = false,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <Text selectable style={[s.copy, muted && { color: c.muted }]}>
      {children}
    </Text>
  );
}
export function Title({ children }: { children: ReactNode }) {
  return <Text style={s.title}>{children}</Text>;
}
export function Row({ children }: { children: ReactNode }) {
  return <View style={s.row}>{children}</View>;
}
export function Card({
  children,
  tint = c.surface,
}: {
  children: ReactNode;
  tint?: string;
}) {
  return <View style={[s.card, { backgroundColor: tint }]}>{children}</View>;
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: c.ink }]}>{label}</Text>
    </Pressable>
  );
}
export function Go({
  label,
  href,
  secondary = false,
}: {
  label: string;
  href: Href;
  secondary?: boolean;
}) {
  return (
    <Button
      label={label}
      onPress={() => router.push(href)}
      secondary={secondary}
    />
  );
}
const badgeTones = {
  blue: { bg: c.lime, text: c.green },
  green: { bg: c.mintBg, text: c.mint },
  darkBlue: { bg: c.navyBg, text: c.navy },
  purple: { bg: c.purpleBg, text: c.purple },
  yellow: { bg: c.yellowBg, text: c.yellow },
  orange: { bg: c.orangeLight, text: c.orangeText },
};
export type BadgeTone = keyof typeof badgeTones;
export const rarityTone: Record<string, BadgeTone> = {
  Common: "green",
  Rare: "darkBlue",
  "Super Rare": "purple",
};
export const moodTone: Record<string, BadgeTone> = {
  Sleepy: "purple",
  Refreshed: "blue",
  Happy: "orange",
};
export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const t = badgeTones[tone];
  return (
    <View style={[s.badge, { backgroundColor: t.bg }]}>
      <Text style={[s.badgeText, { color: t.text }]}>{children}</Text>
    </View>
  );
}
export function Progress({
  value,
  label,
  color = c.green,
}: {
  value: number;
  label: string;
  color?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Row>
        <Copy>{label}</Copy>
        <Copy muted>{Math.round(value)}%</Copy>
      </Row>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
        style={s.track}
      >
        <View
          style={[
            s.fill,
            {
              width: `${Math.max(0, Math.min(value, 100))}%`,
              backgroundColor: value >= 100 ? c.mint : color,
            },
          ]}
        />
      </View>
    </View>
  );
}
export function Field({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      placeholderTextColor={c.muted}
      value={value}
      onChangeText={onChangeText}
      style={s.input}
      maxLength={40}
    />
  );
}
export function Sheet({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.scrim}>
        <SafeAreaView style={s.modalArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.sheet}
          >
            <Row>
              <Title>{title}</Title>
              <Button label="✕" secondary onPress={onClose} />
            </Row>
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
type NavIcon = SymbolViewProps["name"];
const nav: {
  href: Href & string;
  label: string;
  icon: NavIcon;
  activeIcon: NavIcon;
}[] = [
  {
    href: "/pets",
    label: "Pets",
    icon: { ios: "pawprint", android: "pets", web: "pets" },
    activeIcon: { ios: "pawprint.fill", android: "pets", web: "pets" },
  },
  {
    href: "/quests",
    label: "Quests",
    icon: { ios: "flag", android: "flag", web: "flag" },
    activeIcon: { ios: "flag.fill", android: "flag", web: "flag" },
  },
  {
    href: "/",
    label: "Home",
    icon: { ios: "house", android: "home", web: "home" },
    activeIcon: { ios: "house.fill", android: "home", web: "home" },
  },
  {
    href: "/party",
    label: "Party",
    icon: { ios: "person.3", android: "groups", web: "groups" },
    activeIcon: { ios: "person.3.fill", android: "groups", web: "groups" },
  },
];
export function Screen({
  children,
  back = false,
}: {
  children: ReactNode;
  back?: boolean;
}) {
  const path = usePathname();
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.shell}>
        <View style={s.top}>
          <Row>
            <View style={s.brandRow}>
              <Image
                source={require("@/assets/images/fittamer-logo.png")}
                style={s.logo}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
              <Text style={s.brand}>FitTamer</Text>
            </View>
            <Badge>PLAY. MOVE. GROW.</Badge>
          </Row>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          {back && (
            <Button
              label="← Back"
              secondary
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
            />
          )}
          {children}
        </ScrollView>
        <View style={s.nav}>
          {nav.map((n) => {
            const active =
              path === n.href ||
              (n.href === "/quests" && path === "/hunt") ||
              (n.href === "/party" && path === "/goal");
            return (
              <Pressable
                key={n.href}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={n.label}
                onPress={() => router.replace(n.href)}
                style={[s.navItem, active && { backgroundColor: c.orangeLight }]}
              >
                <SymbolView
                  name={active ? n.activeIcon : n.icon}
                  size={24}
                  weight={active ? "semibold" : "regular"}
                  tintColor={active ? c.ink : c.muted}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: active ? c.ink : c.muted,
                  }}
                >
                  {n.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.cream },
  shell: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: c.cream,
  },
  top: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: c.line,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 30, height: 30 },
  brand: { color: c.ink, fontSize: 21, fontWeight: "800", letterSpacing: -0.7 },
  content: { padding: 24, gap: 20, paddingBottom: 30 },
  title: { fontSize: 19, fontWeight: "700", color: c.ink, flexShrink: 1 },
  copy: { fontSize: 14, lineHeight: 22, color: c.ink, flexShrink: 1 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    gap: 15,
    borderWidth: 1,
    borderColor: c.line,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 15,
    backgroundColor: c.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary: { backgroundColor: "#263244" },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  badge: {
    backgroundColor: c.lime,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: "800",
    color: c.green,
  },
  track: {
    height: 9,
    borderRadius: 9,
    backgroundColor: "#2A3546",
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: c.green, borderRadius: 9 },
  input: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: c.cream,
    borderWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 15,
    color: c.ink,
    fontSize: 16,
  },
  nav: {
    flexDirection: "row",
    padding: 10,
    gap: 6,
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderColor: c.line,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 7,
    borderRadius: 17,
    minHeight: 58,
  },
  scrim: {
    flex: 1,
    backgroundColor: "#000000B3",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalArea: { maxWidth: 460, width: "100%", maxHeight: "90%" },
  sheet: { backgroundColor: c.surface, borderRadius: 28, padding: 24, gap: 20 },
  petStage: {
    height: 240,
    backgroundColor: c.tint,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  petEmoji: { fontSize: 112, lineHeight: 145 },
});
