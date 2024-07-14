import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { RootStackParamList } from '@/app/navigation/types'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/app/screens/LogInScreen/loginScreen';
import SignUpScreen from '@/app/screens/SignUpScreen/signUpScreen';
import EventScoutingScreen from './screens/EventScoutingScreen/scoutingSheetTemplate';
import TeamScoutingScreen from './screens/TeamScoutingScreen/teamView';
import HomeScreen from './screens/HomeScreen/homeScreen';
import { Provider } from 'react-redux';
import { Provider as JotaiProvider } from 'jotai';
import { store } from '@/dataStore';


const Stack = createNativeStackNavigator<RootStackParamList>();


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // name="<actual name of file's function>"
  return (
    <Provider store = {store}>
      <JotaiProvider>
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} independent = {true}>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="EventScoutingScreen" component={EventScoutingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeamScoutingScreen" component={TeamScoutingScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </JotaiProvider>
    </Provider>
  );
}