import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useNavigation, NavigationProp  } from '@react-navigation/native';
import { ASYNC_STORAGE, FIREBASE_AUTH } from '@/FirebaseConfig';
import { RootStackParamList } from '@/app/navigation/types';

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  const handleTermsOfServicePress = () => {
    navigation.navigate('TermsOfServiceScreen');
  };

  const handlePrivacyPolicyPress = () => {
    navigation.navigate('PrivacyPolicyScreen');
  };

  const auth = FIREBASE_AUTH;
  const db = getFirestore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    setLoading(true);
    setEmail(email.toLowerCase())
    
    try {
      //await ASYNC_STORAGE.clear()
      await createUserWithEmailAndPassword(auth, email, password);
      await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email, password }));

      if (FIREBASE_AUTH.currentUser) {
        const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
        await setDoc(userRef, {
          email: email,
          name: name,
        });
      }

      alert('Account created!');
    } catch (error: any) {
      alert('😓, creation failed:\n' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        placeholderTextColor="#ccc"
        autoCapitalize="words"
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <TouchableOpacity style={styles.createAccountButton} onPress={createAccount}>
            <Text style={styles.createAccountButtonText}>Create your account</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By creating your account, you agree to our{' '}
          <Text style={styles.linkText} onPress={handleTermsOfServicePress}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.linkText} onPress={handlePrivacyPolicyPress}>
            Privacy Policy
          </Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 35,
    marginBottom: 20,
  },
  input: {
    width: '85%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 15,
    paddingHorizontal: 10,
    color: Platform.OS === 'web' ? '#000' : '#fff',
  },
  createAccountButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 15,
    width: '85%',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  termsText: {
    color: '#ccc',
    textAlign: 'center',
  },
  linkText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});
