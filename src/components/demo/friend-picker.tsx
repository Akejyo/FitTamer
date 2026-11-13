import { useState } from "react";
import { Text } from "react-native";
import { useDemo } from "@/state/demo";
import { Button, Copy, Field, Row, Sheet } from "./ui";
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
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("Join hunt");
  const filtered = state.friends.filter((f) =>
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
        <Copy>No friends found.</Copy>
      )}
      <Button
        label={hunt ? `Invite (${selected.length})` : "Done"}
        onPress={onClose}
      />
    </Sheet>
  );
}
