import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import {
  Badge,
  Button,
  Card,
  Copy,
  Progress,
  Row,
  Screen,
  Title,
  c,
} from "@/components/demo/ui";
import { pets, today, useDemo } from "@/state/demo";
const activities = [
  {
    name: "Jumping jacks",
    emoji: "🙌",
    instruction:
      "Stand comfortably. Step or jump your feet apart as you raise your arms. Keep a pace that feels good.",
    energy: 40,
    xp: 5,
  },
  {
    name: "Seated arm circles",
    emoji: "🪑",
    instruction:
      "Sit tall, extend your arms, and make small gentle circles. Change direction halfway through.",
    energy: 30,
    xp: 5,
  },
  {
    name: "Standing stretch",
    emoji: "🌱",
    instruction:
      "Reach up gently, relax your shoulders, and stretch from side to side. Breathe slowly.",
    energy: 35,
    xp: 5,
  },
  {
    name: "Planks",
    emoji: "🌟",
    instruction:
      "Use a wall or comfortable supported plank. Keep breathing and take a rest whenever you need one.",
    energy: 40,
    xp: 5,
  },
  {
    name: "A little room walk",
    emoji: "🚶",
    instruction:
      "Take a gentle walk around your room or hallway. Let your shoulders relax.",
    energy: 40,
    xp: 5,
  },
];
export default function Recharge() {
  const { state, dispatch } = useDemo();
  const [selected, setSelected] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(60);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (selected === null || paused || remaining === 0 || done) return;
    const timer = setInterval(
      () => setRemaining((v) => Math.max(0, v - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [selected, paused, remaining, done]);
  const activity = selected === null ? null : activities[selected];
  const rerolled = state.rechargeReroll === today();
  const list = rerolled ? [1, 2, 4] : [0, 1, 3];
  const pet = pets.find((p) => p.id === state.activePet)!;
  const rewardXP = activity
    ? activity.xp + (activity.name === pet.activity ? 5 : 0)
    : 0;
  function finish() {
    if (!activity || done || remaining > 0) return;
    dispatch({
      type: "recharge",
      energy: activity.energy,
      xp: rewardXP,
      minutes: 1,
    });
    setDone(true);
  }
  return (
    <Screen back>
      {done ? (
        <Card tint={c.lime}>
          <Text style={{ fontSize: 80, textAlign: "center" }}>
            {pet.emoji}✨
          </Text>
          <Title>Refreshed!</Title>
          <Copy>
            +{activity?.energy} energy · +{rewardXP} XP · 1 min
          </Copy>
          <Button label="Back home →" onPress={() => router.replace("/")} />
        </Card>
      ) : activity ? (
        <>
          <Card>
            <Badge>GUIDED MOVEMENT · 1 MIN</Badge>
            <Text style={{ fontSize: 64, textAlign: "center" }}>
              {activity.emoji}
            </Text>
            <Title>{activity.name}</Title>
            <Copy>{activity.instruction}</Copy>
            <Text
              style={{
                fontSize: 64,
                color: c.green,
                textAlign: "center",
                fontWeight: "800",
                fontVariant: ["tabular-nums"],
              }}
            >
              {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")}
            </Text>
            <Progress
              value={((60 - remaining) / 60) * 100}
              label={
                remaining === 0
                  ? "Nice work!"
                  : paused
                    ? "Paused"
                    : "You’ve got this"
              }
            />
            <Row>
              <Badge tone="green">+{activity.energy} ENERGY</Badge>
              <Badge tone="yellow">+{rewardXP} XP</Badge>
            </Row>
            <Button
              label={paused ? "Resume" : "Pause"}
              secondary
              disabled={remaining === 0}
              onPress={() => setPaused((v) => !v)}
            />
            <Button
              label="Done · collect rewards"
              disabled={remaining > 0}
              onPress={finish}
            />
          </Card>
          <Button
            label="Demo: skip timer"
            secondary
            onPress={() => setRemaining(0)}
          />
          <Button
            label="Choose another activity"
            secondary
            onPress={() => {
              setSelected(null);
              setRemaining(60);
              setPaused(false);
            }}
          />
        </>
      ) : (
        <>
          <Row>
            <Title>Activities</Title>
          </Row>
          {list.map((index, i) => (
            <Card key={index}>
              <Row>
                <Text style={{ fontSize: 30 }}>{activities[index].emoji}</Text>
                <ViewText title={`${i + 1}. ${activities[index].name}`} />
                <Badge>1 MIN</Badge>
              </Row>
              <Copy muted>
                +{activities[index].energy} energy · +
                {activities[index].xp +
                  (activities[index].name === pet.activity ? 5 : 0)}{" "}
                XP
                {activities[index].name === pet.activity ? " · +5 bonus" : ""}
              </Copy>
              <Button label="Start →" onPress={() => setSelected(index)} />
            </Card>
          ))}
          <Button
            label={
              rerolled
                ? "Activities refreshed today"
                : "↻ Refresh activities · once a day"
            }
            disabled={rerolled}
            secondary
            onPress={() =>
              dispatch({ type: "reroll", kind: "recharge", date: today() })
            }
          />
        </>
      )}
    </Screen>
  );
}
function ViewText({ title }: { title: string }) {
  return <Title>{title}</Title>;
}
