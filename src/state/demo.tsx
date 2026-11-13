import { createContext, useContext, useReducer, type ReactNode } from "react";
export const pets = [
  {
    id: "panda",
    name: "Panda",
    emoji: "🐼",
    activity: "Planks",
    rarity: "Common",
  },
  {
    id: "fox",
    name: "Ember",
    emoji: "🦊",
    activity: "Campus walks",
    rarity: "Rare",
  },
  {
    id: "frog",
    name: "Sprout",
    emoji: "🐸",
    activity: "Jumping jacks",
    rarity: "Super Rare",
  },
];
export const DEFAULT_AVATAR = "👤";
export const avatarOptions = [
  DEFAULT_AVATAR,
  "🐼",
  "🦊",
  "🐨",
  "🐯",
  "🐸",
  "🐵",
  "🦁",
  "🐧",
  "🦄",
  "🐙",
  "🐲",
];
export type Friend = {
  name: string;
  emoji: string;
  minutes: number;
  activity: string;
};
export const friends: Friend[] = [
  { name: "Ben", emoji: "🐻", minutes: 22, activity: "Walking" },
  { name: "Priya", emoji: "🐱", minutes: 18, activity: "Stretching" },
  { name: "Sam", emoji: "🐰", minutes: 9, activity: "Walking" },
];
type State = {
  energy: number;
  xp: number;
  mood: "Sleepy" | "Happy" | "Refreshed" | "Hiding";
  unlocked: string[];
  activePet: string;
  eggs: number;
  completed: string[];
  party: {
    name: string;
    logo: string;
    members: string[];
    hatched: boolean;
  } | null;
  goal: number;
  activity: string;
  minutes: number;
  evolved: boolean;
  rechargeReroll: string | null;
  questReroll: string | null;
  draft: string[];
  friends: Friend[];
  username: string;
  avatar: string;
};
const initial: State = {
  energy: 25,
  xp: 120,
  mood: "Sleepy",
  unlocked: ["panda"],
  activePet: "panda",
  eggs: 0,
  completed: [],
  party: null,
  goal: 90,
  activity: "Walking",
  minutes: 0,
  evolved: false,
  rechargeReroll: null,
  questReroll: null,
  draft: [],
  friends,
  username: "User",
  avatar: DEFAULT_AVATAR,
};
type Action =
  | {
      type: "recharge";
      energy: number;
      xp: number;
      minutes: number;
    }
  | {
      type: "mood";
      mood: State["mood"];
    }
  | {
      type: "quest";
      id: string;
      xp: number;
    }
  | {
      type: "claim";
    }
  | {
      type: "select";
      id: string;
    }
  | {
      type: "party";
      name: string;
      logo: string;
      members: string[];
    }
  | {
      type: "members";
      members: string[];
    }
  | {
      type: "addFriend";
      friend: Friend;
    }
  | {
      type: "avatar";
      avatar: string;
    }
  | {
      type: "rename";
      username: string;
    }
  | {
      type: "draft";
      members: string[];
    }
  | {
      type: "leave";
    }
  | {
      type: "hatchParty";
    }
  | {
      type: "goal";
      minutes: number;
      activity: string;
    }
  | {
      type: "move";
      minutes: number;
    }
  | {
      type: "evolve";
    }
  | {
      type: "reroll";
      kind: "recharge" | "quest";
      date: string;
    }
  | {
      type: "reset";
    };
export function demoReducer(s: State, a: Action): State {
  switch (a.type) {
    case "recharge":
      return {
        ...s,
        energy: Math.min(100, s.energy + a.energy),
        xp: s.xp + a.xp,
        mood: "Refreshed",
        minutes: s.minutes + a.minutes,
      };
    case "mood":
      return {
        ...s,
        mood: a.mood,
        energy: a.mood === "Sleepy" ? 25 : s.energy,
      };
    case "quest":
      return s.completed.includes(a.id)
        ? s
        : {
            ...s,
            completed: [...s.completed, a.id],
            xp: s.xp + a.xp,
            eggs: s.eggs + 1,
            minutes: s.minutes + 10,
            mood: "Happy",
            energy: Math.min(100, s.energy + 30),
          };
    case "claim": {
      const next = pets.find((p) => !s.unlocked.includes(p.id));
      return !s.eggs || !next
        ? s
        : { ...s, eggs: s.eggs - 1, unlocked: [...s.unlocked, next.id] };
    }
    case "select":
      return s.unlocked.includes(a.id) ? { ...s, activePet: a.id } : s;
    case "party":
      return {
        ...s,
        party: {
          name: a.name,
          logo: a.logo,
          members: a.members,
          hatched: false,
        },
        evolved: false,
      };
    case "members":
      return s.party ? { ...s, party: { ...s.party, members: a.members } } : s;
    case "addFriend":
      return s.friends.some(
        (f) => f.name.toLowerCase() === a.friend.name.toLowerCase(),
      )
        ? s
        : { ...s, friends: [...s.friends, a.friend] };
    case "avatar":
      return { ...s, avatar: a.avatar };
    case "rename":
      return a.username.trim() ? { ...s, username: a.username.trim() } : s;
    case "draft":
      return { ...s, draft: a.members };
    case "leave":
      return { ...s, party: null, evolved: false };
    case "hatchParty":
      return s.party ? { ...s, party: { ...s.party, hatched: true } } : s;
    case "goal":
      return { ...s, goal: a.minutes, activity: a.activity };
    case "move":
      return { ...s, minutes: s.minutes + a.minutes };
    case "evolve":
      return s.evolved || !s.party?.hatched || partyMinutes(s) < s.goal
        ? s
        : { ...s, evolved: true, xp: s.xp + 100 };
    case "reroll":
      return {
        ...s,
        [a.kind === "quest" ? "questReroll" : "rechargeReroll"]: a.date,
      };
    case "reset":
      return initial;
  }
}
const Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initial);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider missing");
  return value;
}
export function today() {
  return new Date().toLocaleDateString("en-CA");
}
export function partyMinutes(s: State) {
  return (
    s.minutes +
    friends
      .filter((f) => s.party?.members.includes(f.name))
      .reduce((sum, f) => sum + f.minutes, 0)
  );
}
