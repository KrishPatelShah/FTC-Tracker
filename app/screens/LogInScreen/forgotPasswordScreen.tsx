import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/FirebaseConfig'; 

type ForgotPasswordProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ modalVisible, setModalVisible }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    try{
      sendPasswordResetEmail(FIREBASE_AUTH, email)
      alert('Check your email to confirm your password reset!')
      setModalVisible(!modalVisible)
    } catch(error : any){
      alert('😓 Password reset failed:\n' + error.message)
    } 
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Password Reset</Text>

          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            placeholderTextColor="#ccc"
            autoCapitalize='none'
            onChangeText={(text)=>{setEmail(text)}}
          />

          <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
            <Text style={styles.resetButtonText}>Reset your password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.backToSignInText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',
  },
  resetButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  backToSignInText: {
    color: '#1E90FF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ForgotPassword;
