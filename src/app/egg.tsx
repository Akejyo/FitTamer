import { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import {
  Badge,
  Button,
  Card,
  Copy,
  Screen,
  Title,
  c,
} from "@/components/demo/ui";
import { pets, useDemo } from "@/state/demo";
export default function Egg() {
  const { state, dispatch } = useDemo();
  const [hatched, setHatched] = useState(false);
  const next = pets.find((p) => !state.unlocked.includes(p.id));
  return (
    <Screen back>
      <Card tint={c.peach}>
        {state.eggs < 1 ? (
          <>
            <Title>No eggs just yet</Title>
            <Copy>Finish a quest or pet hunt to earn your first egg.</Copy>
            <Button
              label="Explore quests →"
              onPress={() => router.replace("/quests")}
            />
          </>
        ) : !next ? (
          <>
            <Title>Collection complete</Title>
            <Button
              label="View collection"
              onPress={() => router.replace("/pets")}
            />
          </>
        ) : (
          <>
            <Badge>{hatched ? next.rarity.toUpperCase() : "MYSTERY EGG"}</Badge>
            <Text
              style={{
                fontSize: 125,
                textAlign: "center",
                paddingVertical: 25,
              }}
            >
              {hatched ? next.emoji : "🥚"}
            </Text>
            <Title>
              {hatched ? `Meet ${next.name}` : "Mystery egg"}
            </Title>
            <Button
              label={hatched ? "Claim companion →" : "Hatch egg ✨"}
              onPress={() => {
                if (!hatched) setHatched(true);
                else {
                  dispatch({ type: "claim" });
                  router.replace("/pets");
                }
              }}
            />
          </>
        )}
      </Card>
    </Screen>
  );
}
