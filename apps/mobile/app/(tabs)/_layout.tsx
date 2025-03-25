import { Tabs } from "expo-router";
import { Banana, Dumbbell } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "darkgray",
      }}
      safeAreaInsets={{ top: 2, bottom: 2 }}
    >
      <Tabs.Screen
        name="sport"
        options={{
          title: "Sport",
          tabBarIcon: ({ color }) => <Dumbbell fontSize={4} color={color} />,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Essen",
          tabBarIcon: ({ color }) => <Banana color={color} />,
        }}
      />
    </Tabs>
  );
}
