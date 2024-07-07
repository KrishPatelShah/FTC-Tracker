import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ForgotPassword from './forgotPasswordScreen';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    setModalVisible(true);
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
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity onPress={handleCreateAccount}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>

      <ForgotPassword modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 15,
    width: '85%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 15,
  },
  createAccountText: {
    color: '#1E90FF',
    fontSize: 16,
    textAlign: 'center',
  },
});
