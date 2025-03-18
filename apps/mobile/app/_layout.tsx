import { StatusBar } from "expo-status-bar";
import "../global.css";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
