import { FontAwesomeIcon } from "@comp/font-awesome-icon";
import { UserSelect } from "@comp/UserSelect";
import { AppColors as AppColors } from "@/lib/app-colors";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

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
        header: () => {
          return (
            <View className="min-h-10 shadow-sm shadow-gray-200 justify-between px-4 flex-row py-1">
              <View className="justify-center">
                <Text className="text-xl font-extrabold italic">
                  The Fitness App
                </Text>
              </View>

              <View className="w-1/3">
                <UserSelect />
              </View>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="sport"
        options={{
          title: "Sport",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="dumbbell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="utensils" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
