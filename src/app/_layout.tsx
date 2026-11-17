import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Shell } from "@/components/demo/ui";
import { DemoProvider } from "@/state/demo";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoProvider>
        <StatusBar style="light" />
        <Shell>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: "#121821" },
            }}
          />
        </Shell>
      </DemoProvider>
    </SafeAreaProvider>
  );
}
