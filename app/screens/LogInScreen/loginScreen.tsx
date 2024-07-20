import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ForgotPassword from './forgotPasswordScreen';
import { FIREBASE_AUTH, ASYNC_STORAGE } from '@/FirebaseConfig'; 
import { ActivityIndicator } from 'react-native-paper';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

export default function LoginScreen (){
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // USER INFO STATE HANDLING
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // don't confuse this with appLoading
  // SETTING AUTHENTICATION VARIABLE
  const auth = FIREBASE_AUTH; // this variable was already created in FirebaseConfig.tsx so we only need to import
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleForgotPassword = () => {
    setModalVisible(true);
  }

  const handleLogin = async () => {
    setLoading(true);
    try{
      await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email, password }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch(error : any){
      alert('😓 Login failed:\n' + error.message)
    } finally {
      setLoading(false);
    }
  }

  const handleCreateAccount = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>FTC Tracker</Text>
      </View>

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

      <TouchableOpacity style={{alignSelf:'flex-start', left: 35}} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" color='#fff' />
        : 
        <>
        <TouchableOpacity style={styles.loginButton} onPress = {handleLogin}>
           <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        </>
      }

      <Text style={styles.orText}>Or</Text>

      <TouchableOpacity onPress={handleCreateAccount}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>

      <ForgotPassword modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#101010',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 35,
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
  forgotPasswordText: {
    color: '#1E90FF',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 10,
    marginTop: -5,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 25,
    width: '85%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    marginTop: 20,
  },
  createAccountText: {
    color: '#1E90FF',
    fontSize: 16,
    textAlign: 'center',
  },
});