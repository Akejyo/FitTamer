import { useState } from "react";
import { Text } from "react-native";
import { friends } from "@/state/demo";
import { Badge, Button, Copy, Field, Row, Sheet } from "./ui";
export function FriendPicker({
  visible,
  onClose,
  selected,
  onChange,
  hunt = false,
}: {
  visible: boolean;
  onClose: () => void;
  selected: string[];
  onChange: (names: string[]) => void;
  hunt?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("Join hunt");
  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Sheet
      visible={visible}
      title={hunt ? "Bring your friends" : "Find your people"}
      onClose={onClose}
    >
      <Field
        placeholder="Search friends"
        value={query}
        onChangeText={setQuery}
      />
      {hunt && (
        <Row>
          {["Join hunt", "Watch & cheer"].map((m) => (
            <Button
              key={m}
              label={`${mode === m ? "✓ " : ""}${m}`}
              secondary={mode !== m}
              onPress={() => setMode(m)}
            />
          ))}
        </Row>
      )}
      {filtered.map((f) => (
        <Row key={f.name}>
          <Text style={{ fontSize: 30 }}>{f.emoji}</Text>
          <Copy>{f.name}</Copy>
          <Badge>DEMO FRIEND</Badge>
          <Button
            secondary
            label={selected.includes(f.name) ? "✓ Added" : "+ Add"}
            onPress={() =>
              onChange(
                selected.includes(f.name)
                  ? selected.filter((n) => n !== f.name)
                  : [...selected, f.name],
              )
            }
          />
        </Row>
      ))}
      {filtered.length === 0 && (
        <Copy>No friends found. Try Ben, Priya, or Sam.</Copy>
      )}
      <Copy muted>
        {hunt
          ? `Invites are simulated. Selected friends will ${mode === "Join hunt" ? "join your hunt" : "watch and send cheers"}.`
          : "Demo members respond immediately. No messages are sent."}
      </Copy>
      <Button
        label={hunt ? `Confirm ${selected.length} demo invites` : "Done"}
        onPress={onClose}
      />
    </Sheet>
  );
}
