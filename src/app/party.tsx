import { useState } from "react";
import { Text, View } from "react-native";
import {
  Badge,
  Button,
  Card,
  Copy,
  Field,
  Go,
  Progress,
  Row,
  Screen,
  Sheet,
  Title,
  c,
} from "@/components/demo/ui";
import { FriendPicker } from "@/components/demo/friend-picker";
import { friends, partyMinutes, useDemo } from "@/state/demo";
export default function Party() {
  const { state, dispatch } = useDemo();
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("Night Owls");
  const [logo, setLogo] = useState("🌙");
  const [members, setMembers] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);
  const [leave, setLeave] = useState(false);
  const [error, setError] = useState("");
  const total = partyMinutes(state);
  return (
    <Screen
      title="Better, together."
      subtitle="Your friends. A shared companion. Small wins for everyone."
    >
      <Row>
        <Title>Your people</Title>
        <Button
          label="Search +"
          secondary
          onPress={() => {
            setMembers(state.party?.members ?? []);
            setPicker(true);
          }}
        />
      </Row>
      <Card>
        {friends.map((f) => (
          <Row key={f.name}>
            <Text style={{ fontSize: 30 }}>{f.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Title>{f.name}</Title>
              <Copy muted>Ready for a little adventure</Copy>
            </View>
            <Badge>DEMO</Badge>
          </Row>
        ))}
      </Card>
      {state.party ? (
        <>
          <Card tint={c.tint}>
            <Row>
              <Text style={{ fontSize: 32 }}>{state.party.logo}</Text>
              <View style={{ flex: 1 }}>
                <Title>{state.party.name}</Title>
                <Copy muted>
                  You + {state.party.members.length} friends · co-op companions
                </Copy>
              </View>
              <Badge>LV {state.evolved ? 2 : 1}</Badge>
            </Row>
            <Text
              style={{ textAlign: "center", fontSize: 90, paddingVertical: 10 }}
            >
              {state.party.hatched ? "🦊" : "🥚"}
            </Text>
            <Title>
              {state.party.hatched
                ? state.evolved
                  ? "Ember evolved. Together!"
                  : "Meet Ember, your party pet."
                : "Your party’s first shared egg."}
            </Title>
            <Copy muted>
              {state.party.hatched
                ? "Every little move helps your shared companion grow."
                : "A new adventure starts with your whole squad."}
            </Copy>
            {state.party.hatched ? (
              <>
                <Progress
                  value={Math.min(100, (total / state.goal) * 100)}
                  label={`${total} / ${state.goal} shared minutes`}
                />
                <Go label="Weekly goal & progress →" href="/goal" />
              </>
            ) : (
              <Button
                label="Hatch your party egg ✨"
                onPress={() => dispatch({ type: "hatchParty" })}
              />
            )}
          </Card>
          <Card>
            <Title>In your party</Title>
            <Row>
              <Copy>🐼 Marcus (you)</Copy>
              <Badge>{state.completed.length} QUESTS</Badge>
            </Row>
            {state.party.members.map((member) => (
              <Row key={member}>
                <Copy>
                  {friends.find((f) => f.name === member)?.emoji} {member}
                </Copy>
                <Badge>
                  {friends.find((f) => f.name === member)?.minutes} MIN
                </Badge>
              </Row>
            ))}
            <Button
              label="Add or manage members"
              secondary
              onPress={() => {
                setMembers(state.party!.members);
                setPicker(true);
              }}
            />
            <Button
              label="Leave party"
              secondary
              onPress={() => setLeave(true)}
            />
          </Card>
        </>
      ) : (
        <Card tint={c.lime}>
          <Text style={{ fontSize: 65, textAlign: "center" }}>🥚🌱</Text>
          <Title>Your next adventure is a team effort.</Title>
          <Copy>
            Create a party, hatch a shared pet, and help it grow with your
            friends. Every contribution counts.
          </Copy>
          <Button label="+ Create a party" onPress={() => setCreate(true)} />
        </Card>
      )}
      <Sheet
        visible={create}
        title="Make it your own."
        onClose={() => setCreate(false)}
      >
        <Copy>Party name</Copy>
        <Field
          placeholder="Name your party"
          value={name}
          onChangeText={setName}
        />
        <Copy>Choose your logo</Copy>
        <Row>
          {["🌙", "🌱", "🔥", "👑"].map((l) => (
            <Button
              key={l}
              label={`${l}${logo === l ? " ✓" : ""}`}
              secondary={logo !== l}
              onPress={() => setLogo(l)}
            />
          ))}
        </Row>
        <Copy>
          Members: you{members.length > 0 ? `, ${members.join(", ")}` : ""}
        </Copy>
        <Button
          label="+ Add friends"
          secondary
          onPress={() => {
            setCreate(false);
            setPicker(true);
          }}
        />
        {!!error && <Copy>{error}</Copy>}
        <Button
          label="Create your party →"
          onPress={() => {
            if (!name.trim()) {
              setError("Give your party a name first.");
              return;
            }
            dispatch({ type: "party", name: name.trim(), logo, members });
            setError("");
            setCreate(false);
          }}
        />
      </Sheet>
      <FriendPicker
        visible={picker}
        selected={members}
        onChange={setMembers}
        onClose={() => {
          setPicker(false);
          if (state.party) dispatch({ type: "members", members });
          else setCreate(true);
        }}
      />
      <Sheet
        visible={leave}
        title="Leave your party?"
        onClose={() => setLeave(false)}
      >
        <Copy>
          Your personal pets and XP stay with you. The shared party will be
          cleared in this demo.
        </Copy>
        <Button label="Stay with my party" onPress={() => setLeave(false)} />
        <Button
          label="Leave party"
          secondary
          onPress={() => {
            dispatch({ type: "leave" });
            setMembers([]);
            setLeave(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}
