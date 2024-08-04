import { DarkTheme, DefaultTheme, NavigationContainer, DrawerActions } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootStackParamList } from '@/app/navigation/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/LoadingScreen/loadingScreen';
import LoginScreen from '@/app/screens/LogInScreen/loginScreen';
import SignUpScreen from '@/app/screens/SignUpScreen/signUpScreen';
import EventScoutingScreen from './screens/EventScoutingScreen/scoutingSheetTemplate';
import TeamScoutingScreen from './screens/TeamScoutingScreen/teamView';
import HomeScreen from './screens/HomeScreen/homeScreen';
import MyScoutingSheetsScreen from './screens/MyScoutingSheetsScreen/myScoutingSheetsScreen';
import { Provider } from 'react-redux';
import { Provider as JotaiProvider } from 'jotai';
import { store } from '@/dataStore';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { FIREBASE_AUTH, ASYNC_STORAGE } from '@/FirebaseConfig';
import TeamInfoScreen from './screens/TeamInfoScreen/TeamInfoScreen';
import EventInfoScreen from './screens/EventInfoScreen/EventInfoScreen';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Entypo';
import DrawerContent from '../components/DrawerContent';
import { useNavigation } from '@react-navigation/native';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen/termsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen/privacyPolicyScreen';

function InsideLayout() {
  const colorScheme = useColorScheme();
  const InsideStack = createNativeStackNavigator<RootStackParamList>();
  const navigation = useNavigation();

  return (
    <Provider store={store}>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} independent={true}>
        <InsideStack.Navigator
          screenOptions={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,              
          }}
        >
          <InsideStack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{          
              headerRight: () => (
                <Icon
                  name="menu"
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  size={30}
                  color="#fff"
                />
              ),
            }} 
          />
          <InsideStack.Screen name="MyScoutingSheetsScreen" component={MyScoutingSheetsScreen} />
          <InsideStack.Screen name="EventScoutingScreen" component={EventScoutingScreen} />
          <InsideStack.Screen name="TeamScoutingScreen" component={TeamScoutingScreen} />
          <InsideStack.Screen name="TeamInfoScreen" component={TeamInfoScreen} />
          <InsideStack.Screen name="EventInfoScreen" component={EventInfoScreen} />
        </InsideStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
    >
      <Drawer.Screen name="HomeScreen" component={InsideLayout} />
      <Drawer.Screen 
        name="TermsOfServiceScreen" 
        component={TermsOfServiceScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => null,
          headerRight: () => (
            <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              size={30}
              color="#fff"
              style={{ marginRight: 19 }} 
            />
          ),
        }} 
      />
      <Drawer.Screen 
        name="PrivacyPolicyScreen" 
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => null, 
          headerRight: () => (
            <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              size={30}
              color="#fff"
              style={{ marginRight: 19 }}
            />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setAppLoading(false);
    });

    const checkAuth = async () => {
      try {
        const storedAuth = await ASYNC_STORAGE.getItem('auth_persistence');
        if (storedAuth) {
          const { email, password } = JSON.parse(storedAuth);
          await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        }
      } catch (error) {
        console.log('Auto login failed:', error);
      } finally {
        setAppLoading(false);
      }
    };

    checkAuth();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Provider store={store}>
      <JotaiProvider>
        <NavigationContainer theme={DarkTheme} independent={true}>
          <Stack.Navigator>
            {appLoading ? (
              <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
            ) : (
              <>
                {user ? (
                  <Stack.Screen name="Inside" component={DrawerNav} options={{ headerShown: false }} />
                ) : (
                  <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />


                  </>
                )}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </JotaiProvider>
    </Provider>
  );
}
