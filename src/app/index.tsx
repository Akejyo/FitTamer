import { useState } from "react";
import { Text, View } from "react-native";
import {
  Badge,
  Button,
  Card,
  Copy,
  Go,
  Progress,
  Row,
  Screen,
  Sheet,
  Title,
  c,
  moodTone,
  s,
} from "@/components/demo/ui";
import { pets, useDemo } from "@/state/demo";

export default function Home() {
  const { state, dispatch } = useDemo();
  const [settings, setSettings] = useState(false);
  const pet = pets.find((p) => p.id === state.activePet)!;
  return (
    <Screen
      title="A little move. A big adventure."
      subtitle="Hey Marcus, your companion is happy you're here."
    >
      <Row>
        <Badge>LEVEL {Math.floor(state.xp / 100) + 1} TAMER</Badge>
        <Copy>{state.xp} XP ✦</Copy>
      </Row>
      <Card>
        <Row>
          <Title>{pet.name}&apos;s little world</Title>
          <Badge tone={moodTone[state.mood] ?? "blue"}>
            {state.mood.toUpperCase()}
          </Badge>
        </Row>
        <View style={s.petStage}>
          <Text style={s.petEmoji}>
            {state.mood === "Hiding" ? "❔" : pet.emoji}
          </Text>
          <Text style={{ color: c.green, fontWeight: "600" }}>
            {state.mood === "Sleepy"
              ? "Z z z … a tiny break?"
              : state.mood === "Hiding"
                ? "Somewhere on campus…"
                : "Growing together, one move at a time."}
          </Text>
        </View>
        <Progress
          value={state.energy}
          label="Companion energy"
          color={c.mint}
        />
        {state.mood === "Hiding" ? (
          <Go label={`Find ${pet.name} →`} href="/hunt" />
        ) : state.energy < 50 ? (
          <Go label="ϟ Recharge together" href="/recharge" />
        ) : (
          <Copy muted>Feeling refreshed. Ready for your next adventure?</Copy>
        )}
      </Card>
      {state.eggs > 0 && (
        <Card tint={c.peach}>
          <Title>🥚 An egg! A new friend awaits.</Title>
          <Copy>
            You earned {state.eggs} {state.eggs === 1 ? "egg" : "eggs"} on your
            adventures.
          </Copy>
          <Go label="Hatch your egg →" href="/egg" />
        </Card>
      )}
      <Row>
        <Title>Your next little adventure</Title>
        <Badge>NO PRESSURE</Badge>
      </Row>
      <Card tint={c.tint}>
        <Row>
          <Text style={{ fontSize: 35 }}>🧭</Text>
          <View style={{ flex: 1 }}>
            <Title>Someone is hiding…</Title>
            <Copy muted>A campus wander with a happy ending.</Copy>
          </View>
        </Row>
        <Go label="Start a pet hunt →" href="/hunt" />
      </Card>
      <Row>
        <View style={{ flex: 1 }}>
          <Go label="⚑ Explore quests" href="/quests" secondary />
        </View>
        <View style={{ flex: 1 }}>
          <Go label="♧ Meet your party" href="/party" secondary />
        </View>
      </Row>
      <Button
        label="Demo controls"
        secondary
        onPress={() => setSettings(true)}
      />
      <Sheet
        visible={settings}
        title="Demo controls"
        onClose={() => setSettings(false)}
      >
        <Copy muted>
          Switch states to walk through the prototype. Progress is kept for this
          app session.
        </Copy>
        {(["Sleepy", "Happy", "Hiding"] as const).map((mood) => (
          <Button
            key={mood}
            label={`Show ${mood.toLowerCase()} pet`}
            secondary
            onPress={() => {
              dispatch({ type: "mood", mood });
              setSettings(false);
            }}
          />
        ))}
        <Button
          label="Reset all demo progress"
          onPress={() => {
            dispatch({ type: "reset" });
            setSettings(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}
