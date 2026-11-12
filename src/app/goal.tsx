import { useState } from "react";
import { Text } from "react-native";
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
} from "@/components/demo/ui";
import { friends, partyMinutes, useDemo } from "@/state/demo";
export default function Goal() {
  const { state, dispatch } = useDemo();
  const [minutes, setMinutes] = useState(state.goal);
  const [activity, setActivity] = useState(state.activity);
  const [saved, setSaved] = useState(false);
  const [recap, setRecap] = useState(false);
  const total = partyMinutes(state);
  const contributors = [
    {
      name: "Marcus (you)",
      minutes: state.minutes,
      activity: state.activity,
      emoji: "🐼",
    },
    ...friends.filter((f) => state.party?.members.includes(f.name)),
  ];
  const mvp = contributors.reduce(
    (best, f) => (f.minutes > best.minutes ? f : best),
    contributors[0],
  );
  if (!state.party)
    return (
      <Screen back>
        <Card>
          <Copy>Create your party to set a shared weekly goal.</Copy>
          <Go label="Create a party →" href="/party" />
        </Card>
      </Screen>
    );
  return (
    <Screen back>
      {!state.party.hatched ? (
        <Card>
          <Title>Your party pet is waiting.</Title>
          <Go label="Hatch your shared egg first →" href="/party" />
        </Card>
      ) : (
        <>
          <Card>
            <Badge>WEEKLY GOAL</Badge>
            <Title>Movement goal</Title>
            <Row>
              <Button
                label="−"
                secondary
                disabled={minutes <= 30 || state.evolved}
                onPress={() => {
                  setMinutes((v) => v - 30);
                  setSaved(false);
                }}
              />
              <Text style={{ fontSize: 36, fontWeight: "800", color: c.ink }}>
                {minutes} min
              </Text>
              <Button
                label="+"
                secondary
                disabled={minutes >= 300 || state.evolved}
                onPress={() => {
                  setMinutes((v) => v + 30);
                  setSaved(false);
                }}
              />
            </Row>
            <Row>
              {["Walking", "Stretching"].map((a) => (
                <Button
                  key={a}
                  label={a}
                  secondary={activity !== a}
                  disabled={state.evolved}
                  onPress={() => {
                    setActivity(a);
                    setSaved(false);
                  }}
                />
              ))}
            </Row>
            <Button
              label={
                state.evolved
                  ? "This week is complete ✓"
                  : saved
                    ? "Goal saved ✓"
                    : "Set weekly goal"
              }
              disabled={state.evolved}
              onPress={() => {
                dispatch({ type: "goal", minutes, activity });
                setSaved(true);
              }}
            />
          </Card>
          <Card tint="#EAF0E1">
            <Row>
              <Title>Ember</Title>
              <Badge>LEVEL {state.evolved ? 2 : 1}</Badge>
            </Row>
            <Text style={{ fontSize: 80, textAlign: "center" }}>
              {state.evolved ? "🦊✨" : "🦊"}
            </Text>
            <Progress
              value={Math.min(100, (total / state.goal) * 100)}
              label={`${total} of ${state.goal} minutes`}
            />
            {contributors.map((f) => (
              <Row key={f.name}>
                <Text style={{ fontSize: 26 }}>{f.emoji}</Text>
                <Copy>{f.name}</Copy>
                <Copy muted>
                  {f.minutes} min · {f.activity}
                </Copy>
              </Row>
            ))}
            <Button
              label="View weekly recap →"
              secondary
              onPress={() => setRecap(true)}
            />
          </Card>
          <Card>
            <Badge>DEMO TIME CONTROLS</Badge>
            <Button
              label="Demo: +10 min"
              secondary
              disabled={state.evolved}
              onPress={() => dispatch({ type: "move", minutes: 10 })}
            />
            <Button
              label="Demo: complete goal"
              secondary
              disabled={total >= state.goal || state.evolved}
              onPress={() =>
                dispatch({
                  type: "move",
                  minutes: Math.max(0, state.goal - total),
                })
              }
            />
          </Card>
          <Sheet
            visible={recap}
            title="Weekly recap"
            onClose={() => setRecap(false)}
          >
            <Badge>
              {total >= state.goal ? "GOAL COMPLETE ✨" : "STILL GROWING 🌱"}
            </Badge>
            <Text style={{ fontSize: 60, textAlign: "center" }}>🏆🦊</Text>
            <Title>MVP: {mvp.name}</Title>
            <Copy>{mvp.minutes} min</Copy>
            <Progress
              value={Math.min(100, (total / state.goal) * 100)}
              label={`${total} / ${state.goal} shared minutes`}
            />
            <Button
              label={
                state.evolved
                  ? "Ember reached level 2 ✓"
                  : "Evolve Ember · +100 XP"
              }
              disabled={total < state.goal || state.evolved}
              onPress={() => dispatch({ type: "evolve" })}
            />
            {state.evolved && (
              <Card tint={c.lime}>
                <Title>Party level 1 → 2</Title>
                <Copy>+100 XP</Copy>
              </Card>
            )}
          </Sheet>
        </>
      )}
    </Screen>
  );
}
