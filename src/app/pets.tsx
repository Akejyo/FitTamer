import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import {
  Badge,
  Button,
  Card,
  Go,
  Row,
  rarityTone,
  Screen,
  Title,
  c,
} from "@/components/demo/ui";
import { pets, useDemo } from "@/state/demo";
export default function Pets() {
  const { state, dispatch } = useDemo();
  const [selected, setSelected] = useState(state.activePet);
  const pet = pets.find((p) => p.id === selected)!;
  return (
    <Screen>
      <Row>
        <Title>Your collection</Title>
        <Badge tone="purple">
          {state.unlocked.length} / 100 DISCOVERED
        </Badge>
      </Row>
      <Card tint={c.tint}>
        <Row>
          <Text style={{ fontSize: 70 }}>{pet.emoji}</Text>
          <View style={{ flex: 1, gap: 5 }}>
            <Badge tone={rarityTone[pet.rarity] ?? "green"}>
              {pet.rarity.toUpperCase()}
            </Badge>
            <Title>{pet.name}</Title>
          </View>
        </Row>
        <Button
          label={
            state.activePet === selected
              ? "Your current companion ✓"
              : `Choose ${pet.name}`
          }
          disabled={state.activePet === selected}
          onPress={() => dispatch({ type: "select", id: selected })}
        />
      </Card>
      {state.eggs > 0 && (
        <Go label={`🥚 Hatch an egg (${state.eggs})`} href="/egg" />
      )}
      <FlatList
        scrollEnabled={false}
        numColumns={3}
        data={Array.from({ length: 12 }, (_, i) => i)}
        keyExtractor={(i) => String(i)}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const p = pets[item];
          const unlocked = !!p && state.unlocked.includes(p.id);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                unlocked ? `View ${p.name}` : "Undiscovered pet"
              }
              disabled={!unlocked}
              onPress={() => setSelected(p.id)}
              style={{
                flex: 1,
                aspectRatio: 0.85,
                borderRadius: 21,
                borderWidth: 2,
                borderColor:
                  unlocked && selected === p.id ? c.yellow : c.line,
                backgroundColor: unlocked ? c.surface : "#161D27",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Text style={{ fontSize: 42, color: "#4A5566" }}>
                {unlocked ? p.emoji : "?"}
              </Text>
              {unlocked && <Text style={{ color: c.ink, fontSize: 11 }}>{p.name}</Text>}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
