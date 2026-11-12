import { Pressable, StyleSheet, Text, View } from "react-native";
import { c } from "./ui";
const places = [
  { name: "Library", icon: "📚", left: "8%", top: "13%" },
  { name: "Lawn", icon: "🌳", left: "60%", top: "15%" },
  { name: "Coffee cart", icon: "☕", left: "64%", top: "55%" },
  { name: "Gym", icon: "🏫", left: "12%", top: "65%" },
] as const;
export function CampusMap({
  progress = 0,
  hunt = false,
  onSelect,
  selected = 0,
}: {
  progress?: number;
  hunt?: boolean;
  onSelect?: (i: number) => void;
  selected?: number;
}) {
  return (
    <View style={m.map} accessibilityLabel="Illustrated demo campus map">
      <View style={m.river} />
      <View style={m.path1} />
      <View style={m.path2} />
      {hunt && (
        <View style={m.zone}>
          <Text style={{ fontSize: 35 }}>?</Text>
        </View>
      )}
      {places.map((p, i) => (
        <Pressable
          key={p.name}
          accessibilityRole="button"
          accessibilityLabel={p.name}
          onPress={() => onSelect?.(i)}
          style={[
            m.place,
            { left: p.left, top: p.top },
            !hunt && selected === i && { borderColor: c.green, borderWidth: 2 },
          ]}
        >
          <Text style={{ fontSize: 27 }}>{p.icon}</Text>
          <Text style={{ fontSize: 10, color: c.ink, fontWeight: "600" }}>
            {p.name}
          </Text>
        </Pressable>
      ))}
      <View
        style={[
          m.you,
          { left: `${23 + progress * 10}%`, top: `${47 + progress * 4}%` },
        ]}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>
          YOU
        </Text>
      </View>
      <Text style={m.label}>CAMPUS · ILLUSTRATED DEMO MAP</Text>
    </View>
  );
}
const m = StyleSheet.create({
  map: {
    height: 330,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#DBE8C7",
    position: "relative",
    borderWidth: 1,
    borderColor: "#C5D5B4",
  },
  river: {
    width: 500,
    height: 38,
    backgroundColor: "#A7D8DB",
    position: "absolute",
    top: 175,
    left: -45,
    transform: [{ rotate: "-27deg" }],
  },
  path1: {
    position: "absolute",
    width: 450,
    height: 15,
    backgroundColor: "#F7F1D7",
    top: 130,
    left: -30,
    transform: [{ rotate: "32deg" }],
  },
  path2: {
    position: "absolute",
    width: 450,
    height: 12,
    backgroundColor: "#F7F1D7",
    top: 170,
    left: -40,
    transform: [{ rotate: "-65deg" }],
  },
  place: {
    position: "absolute",
    padding: 8,
    alignItems: "center",
    backgroundColor: "#F8F7ECCC",
    borderRadius: 12,
  },
  zone: {
    position: "absolute",
    top: 135,
    right: 20,
    width: 135,
    height: 135,
    borderRadius: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D69A43",
    backgroundColor: "#F6D88980",
    alignItems: "center",
    justifyContent: "center",
  },
  you: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: c.green,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    color: c.green,
    fontSize: 9,
    letterSpacing: 1,
  },
});
