import { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  Card,
  Copy,
  Field,
  Row,
  Sheet,
  Title,
} from "@/components/demo/ui";
import { useDemo } from "@/state/demo";

const avatars = ["🦊", "🐨", "🐯", "🐸", "🐵", "🦁"];

export function FriendsList() {
  const { state, dispatch } = useDemo();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(avatars[0]);
  const [error, setError] = useState("");
  const query = search.trim().toLowerCase();
  const shown = state.friends.filter((f) =>
    f.name.toLowerCase().includes(query),
  );
  const openAdd = (prefill = "") => {
    setName(prefill);
    setEmoji(avatars[0]);
    setError("");
    setAdding(true);
  };
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your friend's name.");
      return;
    }
    if (
      state.friends.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError(`${trimmed} is already your friend.`);
      return;
    }
    dispatch({
      type: "addFriend",
      friend: { name: trimmed, emoji, minutes: 0, activity: "Walking" },
    });
    setSearch("");
    setAdding(false);
  };
  return (
    <>
      <Row>
        <Title>Friends</Title>
        <Button label="+ Add new friend" secondary onPress={() => openAdd()} />
      </Row>
      <Field
        placeholder="Search friends"
        value={search}
        onChangeText={setSearch}
      />
      <Card>
        {shown.length === 0 && (
          <>
            <Copy muted>No friends match “{search.trim()}”.</Copy>
            <Button
              label={`+ Add “${search.trim()}” as a friend`}
              secondary
              onPress={() => openAdd(search.trim())}
            />
          </>
        )}
        {shown.map((f) => {
          const added = (state.party?.members ?? state.draft).includes(f.name);
          return (
            <Row key={f.name}>
              <Text style={{ fontSize: 30 }}>{f.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Title>{f.name}</Title>
              </View>
              <Button
                label={added ? "In party ✓" : "+ Add to party"}
                secondary={added}
                disabled={added && !!state.party}
                onPress={() => {
                  if (state.party) {
                    dispatch({
                      type: "members",
                      members: [...state.party.members, f.name],
                    });
                  } else {
                    dispatch({
                      type: "draft",
                      members: added
                        ? state.draft.filter((m) => m !== f.name)
                        : [...state.draft, f.name],
                    });
                  }
                }}
              />
            </Row>
          );
        })}
      </Card>
      <Sheet
        visible={adding}
        title="Add a friend"
        onClose={() => setAdding(false)}
      >
        <Copy>Friend’s name</Copy>
        <Field placeholder="Name" value={name} onChangeText={setName} />
        <Copy>Pick their avatar</Copy>
        <Row>
          {avatars.map((a) => (
            <Button
              key={a}
              label={`${a}${emoji === a ? " ✓" : ""}`}
              secondary={emoji !== a}
              onPress={() => setEmoji(a)}
            />
          ))}
        </Row>
        {!!error && <Copy>{error}</Copy>}
        <Button label="Add friend →" onPress={save} />
      </Sheet>
    </>
  );
}
