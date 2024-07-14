import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
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
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

const Stack = createNativeStackNavigator<RootStackParamList>();
const InsideStack = createNativeStackNavigator<RootStackParamList>();
const colorScheme = useColorScheme();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const[user, setUser] = useState<User | null>(null);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Not entirely sure about efficienty here
  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
       setUser(user);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store = {store}>
        <JotaiProvider>
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} independent = {true}>
        <Stack.Navigator>
          {user ?
            (<Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }}/>) 
            : 
            (<>
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            </>)
          }
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </JotaiProvider>
    </Provider>
  );
}

function InsideLayout(){
  return(
    <Provider store = {store}>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} independent = {true}>
        <InsideStack.Navigator>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} /> 
          <Stack.Screen name="EventScoutingScreen" component={EventScoutingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TeamScoutingScreen" component={TeamScoutingScreen} options={{ headerShown: false }} />
        </InsideStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}