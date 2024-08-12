import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../../FirebaseConfig';
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updatePassword, updateEmail } from 'firebase/auth';

const ProfileScreen = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userRef = doc(collection(FIRESTORE_DB, 'user_data'), user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name);
            setUserEmail(userData.email);
          } else {
            console.warn("No User Info");
            setUserName("No Data");
            setUserEmail("No Data");
          }
        } else {
          console.warn("No user logged in!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

//   const [password, setPassword] = useState(''); 
//   const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

//   const togglePasswordVisibility = () => {
//     setIsPasswordHidden(!isPasswordHidden);
//   };

  const handleSaveChanges = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      try {
        await updateEmail(user, userEmail);
        const userDocRef = doc(FIRESTORE_DB, 'user_data', user.uid);
        await updateDoc(userDocRef, {
          email: userEmail,
          name: userName,
        });

        // if (password) {
        //   await updatePassword(user, password); 
        // }

        Alert.alert('Success', 'Your profile has been updated.');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile.');
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
              const userRef = doc(collection(FIRESTORE_DB, 'user_data'), user.uid);
              const userDoc = await getDoc(userRef);
              if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(userData.name);
                setUserEmail(userData.email);}}}
        catch (error) {
            console.error("Error fetching user data: ", error); }
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        await deleteDoc(userDocRef);
        await user.delete();
        FIREBASE_AUTH.signOut();
        Alert.alert('Account Deleted', 'Your account has been deleted.');
      } catch (error) {
        Alert.alert('Error', 'Failed to delete account.');
      }
    }
  };

  const confirmDeleteAccount = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Information</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordHidden}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon name={isPasswordHidden ? "eye-off-outline" : "eye-outline"} size={24} color="gray" />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleDeleteAccount}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#000',
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      color: '#0096FF',
      alignSelf: 'flex-start',
      marginBottom: 5,
    },
    input: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 5,
      marginBottom: 20,
      color: '#fff',
    },
    passwordContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 20,
    },
    saveButton: {
      width: '100%',
      padding: 15,
      backgroundColor: '#0096FF',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    deleteButton: {
      width: '100%',
      padding: 15,
      backgroundColor: '#FF3B30',
      alignItems: 'center',
      borderRadius: 5,
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: 300,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      padding: 10,
      backgroundColor: '#0096FF',
      borderRadius: 5,
    },
    modalButtonText: {
      color: '#fff',
    },
  });
  
