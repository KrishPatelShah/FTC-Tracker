import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
import LoginPage from '@/app/(tabs)/loginPage';
import CreateAccountPage from '@/app/(tabs)/createAccountPage';
import MatchLoader from './matchLoader';
import HomePage from './homePage'; 
import ScoutingSheet from './scoutingSheetTemplate';
import IndivTeamView from './teamView';

import { Provider } from 'react-redux';
import { store } from '@/dataStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Provider store = {store}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="loginPage"
          component={LoginPage}
          options={{
            title: 'homereal',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="createAccount"
          component={CreateAccountPage}
          options={{
            title: 'createAccount',
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
          name="homePage"
          component={HomePage}
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
        <Tab.Screen
          name="teamView"
          component={IndivTeamView}
          options={{
            title: 'teams',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      </Provider>
    
    
    
  );
}


