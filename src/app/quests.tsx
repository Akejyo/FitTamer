import { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import {
  Badge,
  Button,
  Card,
  Copy,
  Row,
  Screen,
  Sheet,
  Title,
} from "@/components/demo/ui";
import { CampusMap } from "@/components/demo/campus-map";
import { today, useDemo } from "@/state/demo";
const quests = [
  {
    id: "library",
    name: "The library loop",
    place: "Library",
    text: "Take a little wander around the library.",
    xp: 50,
    icon: "📚",
  },
  {
    id: "lawn",
    name: "A breath of fresh air",
    place: "Campus lawn",
    text: "Find a patch of green and take a gentle stretch.",
    xp: 50,
    icon: "🌳",
  },
  {
    id: "coffee",
    name: "The coffee cart trail",
    place: "Coffee cart",
    text: "A short stroll. A tiny adventure. Maybe a coffee.",
    xp: 100,
    icon: "☕",
  },
  {
    id: "gym",
    name: "A new corner of campus",
    place: "Gym courtyard",
    text: "Explore a place you haven’t visited today.",
    xp: 100,
    icon: "🏫",
  },
];
export default function Quests() {
  const { state, dispatch } = useDemo();
  const [map, setMap] = useState(false);
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [arrived, setArrived] = useState(false);
  const rerolled = state.questReroll === today();
  const q = active === null ? null : quests[active];
  function start(index: number) {
    setActive(index);
    setArrived(false);
  }
  return (
    <Screen>
      <Row>
        <Title>{map ? "Around campus" : "Today’s adventures"}</Title>
        <Button
          label={map ? "☷ List" : "⌖ Map"}
          secondary
          onPress={() => setMap((v) => !v)}
        />
      </Row>
      {map ? (
        <>
          <CampusMap selected={selected} onSelect={setSelected} />
          <Card>
            <Title>{quests[selected].name}</Title>
            <Copy muted>
              {quests[selected].place} · +{quests[selected].xp} XP · mystery egg
            </Copy>
            <Button
              label={
                state.completed.includes(quests[selected].id)
                  ? "Completed ✓"
                  : "Start quest →"
              }
              disabled={state.completed.includes(quests[selected].id)}
              onPress={() => start(selected)}
            />
          </Card>
          <Button
            label="⌖ Recenter demo map"
            secondary
            onPress={() => setSelected(0)}
          />
        </>
      ) : (
        <>
          {(rerolled ? [1, 2, 3] : [0, 1, 2]).map((i) => (
            <Card key={quests[i].id}>
              <Row>
                <Text style={{ fontSize: 32 }}>{quests[i].icon}</Text>
                <Title>{quests[i].name}</Title>
                <Badge tone="yellow">+{quests[i].xp} XP</Badge>
              </Row>
              <Row>
                <Copy>10 min · 🥚 Mystery egg</Copy>
                <Badge>{quests[i].place.toUpperCase()}</Badge>
              </Row>
              <Button
                label={
                  state.completed.includes(quests[i].id)
                    ? "Completed ✓"
                    : "Start quest →"
                }
                disabled={state.completed.includes(quests[i].id)}
                onPress={() => start(i)}
              />
            </Card>
          ))}
          <Button
            label={
              rerolled
                ? "Quests refreshed today"
                : "↻ Refresh quests · once a day"
            }
            disabled={rerolled}
            secondary
            onPress={() =>
              dispatch({ type: "reroll", kind: "quest", date: today() })
            }
          />
        </>
      )}
      <Button
        label="Start a pet hunt →"
        secondary
        onPress={() => router.push("/hunt")}
      />
      <Sheet
        visible={active !== null}
        title={arrived ? "Adventure complete!" : (q?.name ?? "Quest")}
        onClose={() => setActive(null)}
      >
        {arrived ? (
          <>
            <Text style={{ fontSize: 70, textAlign: "center" }}>🥚✨</Text>
            <Copy>+{q?.xp} XP · +30 energy · 1 mystery egg</Copy>
            <Copy>+10 party minutes</Copy>
            <Button
              label="Hatch your reward →"
              onPress={() => {
                setActive(null);
                router.push("/egg");
              }}
            />
          </>
        ) : (
          <>
            <Copy>{q?.text}</Copy>
            <Button
              label="Demo: finish this adventure"
              onPress={() => {
                if (!q) return;
                dispatch({ type: "quest", id: q.id, xp: q.xp });
                setArrived(true);
              }}
            />
          </>
        )}
      </Sheet>
    </Screen>
  );
}
