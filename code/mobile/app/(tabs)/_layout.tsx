import { FontAwesomeIcon } from "@comp/font-awesome-icon";
import { AppColors as AppColors } from "@/lib/app-colors";
import { Tabs } from "expo-router";
import { AppHeader } from "@/components/AppHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: AppColors.PINK_100,
        tabBarActiveTintColor: AppColors.WHITE,
        tabBarStyle: {
          backgroundColor: AppColors.PRIMARY,
          shadowColor: AppColors.PINK_700,
          shadowRadius: 10,
          shadowOpacity: 0.5,
          borderTopWidth: 0,
        },
        header: () => <AppHeader />,
      }}
    >
      <Tabs.Screen
        name="sport"
        options={{
          title: "Sport",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="dumbbell" color={color} className="mt-2" />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="utensils" color={color} className="mt-2" />
          ),
        }}
      />
    </Tabs>
  );
}
