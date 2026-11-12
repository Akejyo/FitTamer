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
export const c = {
  ink: "#243D35",
  muted: "#738178",
  green: "#34785B",
  lime: "#D9EDB3",
  cream: "#F8F7F0",
  line: "#E3E8DB",
  peach: "#F8E2C4",
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
  tint = "#FFFFFF",
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
export function Badge({ children }: { children: ReactNode }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{children}</Text>
    </View>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
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
          style={[s.fill, { width: `${Math.max(0, Math.min(value, 100))}%` }]}
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
const nav = [
  { href: "/pets", label: "Pets", icon: "♧" },
  { href: "/quests", label: "Quests", icon: "⚑" },
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/party", label: "Party", icon: "♧♧" },
] as const;
export function Screen({
  title,
  subtitle,
  children,
  back = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  back?: boolean;
}) {
  const path = usePathname();
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.shell}>
        <View style={s.top}>
          <Row>
            <Text style={s.brand}>✳ FitTamer</Text>
            <Badge>PLAY. MOVE. GROW.</Badge>
          </Row>
        </View>
        <ScrollView
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
          <View style={{ gap: 6 }}>
            <Text style={s.heading}>{title}</Text>
            <Copy muted>{subtitle}</Copy>
          </View>
          {children}
          <Text style={s.footnote}>
            INTERACTIVE DEMO · Simulated movement & friends
          </Text>
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
                style={[s.navItem, active && { backgroundColor: c.lime }]}
              >
                <Text style={{ fontSize: 23, color: c.ink }}>{n.icon}</Text>
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
  safe: { flex: 1, backgroundColor: "#EAF0E3" },
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
  brand: { color: c.ink, fontSize: 21, fontWeight: "800", letterSpacing: -0.7 },
  content: { padding: 24, gap: 20, paddingBottom: 30 },
  heading: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    color: c.ink,
    letterSpacing: -1,
  },
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
    backgroundColor: c.green,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary: { backgroundColor: "#EBEFDF" },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  badge: {
    backgroundColor: "#E9EEDC",
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
    backgroundColor: "#E1E7D8",
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
    backgroundColor: "#FFFFFF",
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
  footnote: {
    textAlign: "center",
    fontSize: 10,
    color: c.muted,
    letterSpacing: 0.6,
  },
  scrim: {
    flex: 1,
    backgroundColor: "#152A25AA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalArea: { maxWidth: 460, width: "100%", maxHeight: "90%" },
  sheet: { backgroundColor: c.cream, borderRadius: 28, padding: 24, gap: 20 },
  petStage: {
    height: 240,
    backgroundColor: "#E8EEDB",
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  petEmoji: { fontSize: 112, lineHeight: 145 },
});
