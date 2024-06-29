import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
import HomeScreen from '@/app/(tabs)/homeScreen';
import MatchLoader from './matchLoader';
import MainScreen from './main'; 
import ScoutingSheet from './scoutingSheetTemplate';

import { Provider } from 'react-redux';
import { store } from '@/eventCodeStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <NavigationContainer independent = {true}>
      <Provider store = {store}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="homeScreen"
          component={HomeScreen}
          options={{
            title: 'homereal',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="matchLoader"
          component={MatchLoader}
          options={{
            title: 'matches',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="main"
          component={MainScreen}
          options={{
            title: 'HomeScreen',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="scoutingSheetTemplate"
          component={ScoutingSheet}
          options={{
            title: 'Scouting',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      </Provider>
    </NavigationContainer>
    
    
  );
}


