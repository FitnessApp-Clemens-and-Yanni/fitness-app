import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sport',
          tabBarIcon: () => <View>Sport</View>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Essen',
          tabBarIcon: () => <View></View>,
        }}
      />
    </Tabs>
  );
}
