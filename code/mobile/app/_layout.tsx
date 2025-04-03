import { StatusBar } from "expo-status-bar";
import "../global.css";
import { Stack } from "expo-router";
import { TRPCReactProvider } from "@/utils/react";

export default function MainLayout() {
  return (
    <TRPCReactProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TRPCReactProvider>
  );
}
