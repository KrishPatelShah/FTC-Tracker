import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ASYNC_STORAGE, FIREBASE_AUTH } from '@/FirebaseConfig'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Linking, ActivityIndicator } from 'react-native';

export default function SignUpScreen() {
  const handleTermsOfServicePress = () => {
    Linking.openURL('https://example-terms-of-service-url.com');
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://example-privacy-policy-url.com');
  };

const auth = FIREBASE_AUTH;
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const createAccount = async () => {
  setLoading(true);
  try{
    const response = await createUserWithEmailAndPassword(auth, email, password);
    await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email, password}));
    alert('Account created!')
  } catch(error : any){
    alert('😓, creation failed:\n' + error.message)
  } finally {
    setLoading(false);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <TextInput style={styles.input}
        placeholder="Email"
        value={email}
        placeholderTextColor="#ccc"
        autoCapitalize='none'
        onChangeText={(text)=>{setEmail(text)}}
      />

      <TextInput style={styles.input} 
         placeholder="Password" 
         value={password}
         placeholderTextColor="#ccc" 
         autoCapitalize='none'
         onChangeText={(password)=>{setPassword(password)}}
         secureTextEntry={true}
      />

      {loading ? <ActivityIndicator size="large" color='#fff' />
        : 
        <>
          <TouchableOpacity style={styles.createAccountButton} onPress={createAccount}>
            <Text style={styles.createAccountButtonText}>Create your account</Text>
          </TouchableOpacity>
        </>
      }
      

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
