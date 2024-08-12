import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Avatar, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH, ASYNC_STORAGE, FIRESTORE_DB } from '@/FirebaseConfig';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, doc, onSnapshot } from 'firebase/firestore';

type DrawerListType = {
  icon: string;
  label: string;
  navigateTo: string;
};

const handleSignOut = async () => {
  FIREBASE_AUTH.signOut();
  await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email: null, password: null }));
};

const DrawerList: DrawerListType[] = [
  { icon: 'home-outline', label: 'Home', navigateTo: 'HomeScreen' },
  { icon: 'account', label: 'Profile', navigateTo: 'Profile' },
  { icon: 'shield-check-outline', label: 'Privacy Policy', navigateTo: 'PrivacyPolicyScreen' },
  { icon: 'file-document-outline', label: 'Terms of Service', navigateTo: 'TermsOfServiceScreen' },
  { icon: 'cog-outline', label: 'Settings', navigateTo: '' },
];

const DrawerLayout: React.FC<DrawerListType> = ({ icon, label, navigateTo }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <DrawerItem
      icon={({ color, size }) => <MaterialCommunityIcons name={icon as any} color={color} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
    />
  );
};

const DrawerItems: React.FC = () => {
  return (
    <>
      {DrawerList.map((el, i) => (
        <DrawerLayout key={i} icon={el.icon} label={el.label} navigateTo={el.navigateTo} />
      ))}
    </>
  );
};

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const userRef = doc(FIRESTORE_DB, 'user_data', user.uid);

      // Set up a real-time listener
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserName(userData.name || 'No Data');
          setUserEmail(userData.email || 'No Data');
        } else {
          setUserName('No Data');
          setUserEmail('No Data');
        }
      }, (error) => {
        console.error('Error listening to user data:', error);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } else {
      console.warn('No user logged in!');
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#191919', '#1f1f1f', '#191919']}
        style={styles.gradient}
      >
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.userInfoSection}>
                <View style={styles.userInfo}>
                  <View style={styles.userInfoText}>
                    <Title style={styles.title}>{userName || 'Loading...'}</Title>
                    <Text style={styles.caption} numberOfLines={1}>
                      {userEmail || 'Loading...'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.drawerSection}>
              <DrawerItems />
            </View>
          </View>
        </DrawerContentScrollView>
        <View style={styles.bottomDrawerSection}>
          <DrawerItem
            icon={({ color, size }) => <Octicons name="sign-out" color={color} size={size} />}
            label="Sign Out"
            onPress={handleSignOut}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    marginTop: 15,
  },
  userInfoText: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    width: '100%',
    color: '#b0b0b0',
  },
  drawerSection: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#333333',
    borderTopWidth: 1,
    borderBottomColor: '#333333',
    borderBottomWidth: 1,
  },
});
