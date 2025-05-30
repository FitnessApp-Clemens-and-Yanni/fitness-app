import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { IconColors as AppColors } from "@/lib/app-colors";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: AppColors.PINK_100,
        tabBarActiveTintColor: AppColors.WHITE,
        tabBarStyle: {
          backgroundColor: AppColors.PRIMARY,
          shadowColor: AppColors.BLACK,
          shadowRadius: 10,
          shadowOpacity: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="sport"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="dumbbell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="utensils" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
