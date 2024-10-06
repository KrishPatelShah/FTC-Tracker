import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH, ASYNC_STORAGE,FIRESTORE_DB } from '../../../FirebaseConfig';
import { collection, doc, QueryDocumentSnapshot, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';

const handleSignOut = async () => {
  FIREBASE_AUTH.signOut();
  await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email: null, password: null }));
};

const ProfileScreen = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false); // Second modal for confirming delete
  const [reauthType, setReauthType] = useState<'email' | 'password' | 'delete' | null>(null); // Added 'delete'
  const [currentPassword, setCurrentPassword] = useState<string>('');

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const reauthenticateUser = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        return true;
      } catch (error) {
        Alert.alert("Reauthentication Failed", "Please make sure your current password is correct.");
        return false;
      }
    }
    return false;
  };

  const handleUpdateName = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userRef = doc(FIRESTORE_DB, 'user_data', user.uid);
        await updateDoc(userRef, { name: userName });
        Alert.alert("Success", "Name updated successfully.");
      } catch (error) {
        Alert.alert("Error", "Failed to update name.");
      }
    }
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail(userEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setReauthType('email');
    setModalVisible(true);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    setReauthType('password');
    setModalVisible(true);
  };

  const handleReauthentication = async () => {
    const isReauthenticated = await reauthenticateUser();
    if (isReauthenticated) {
      setModalVisible(false);
      if (reauthType === 'email') {
        try {
          const user = FIREBASE_AUTH.currentUser;
          await updateEmail(user!, userEmail);
          const userDocRef = doc(FIRESTORE_DB, 'user_data', user!.uid);
          await updateDoc(userDocRef, { email: userEmail });
          Alert.alert("Success", "Email updated successfully.");
        } catch (error: any) {
          Alert.alert("Error", error.message);
        }
      } else if (reauthType === 'password') {
        try {
          const user = FIREBASE_AUTH.currentUser;
          await updatePassword(user!, newPassword);
          Alert.alert("Success", "Password updated successfully.");
        } catch (error) {
          Alert.alert("Error", "Failed to update password.");
        }
      } else if (reauthType === 'delete') {
        // show the second modal for delete confirmation after reauthentication
        setConfirmDeleteVisible(true);
      }
      setCurrentPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'user_data', user.uid);
  
        // fetch all scouting sheets
        const sharedSheetsQuery = collection(FIRESTORE_DB, "shared_scouting_sheets");
        const sharedSheetsSnapshot = await getDocs(sharedSheetsQuery);
  
        const removeUserFromSharedSheets = async () => {
          await Promise.all(sharedSheetsSnapshot.docs.map(async (docSnapshot: QueryDocumentSnapshot) => {
            const sheetData = docSnapshot.data();
            const userIds = sheetData.userIds || [];
            const sharedSheetData = sheetData.sharedSheetData || {};
            const ownerID = sharedSheetData.ownerID;
  
            // check if the user is part of this sheet
            if (userIds.includes(user.uid)) {
              const updatedUserIds = userIds.filter((id: string) => id !== user.uid);
  
              if (ownerID === user.uid) {
                // fi user is owner and no other users, delete the sheet
                if (updatedUserIds.length === 0) {
                  await deleteDoc(doc(FIRESTORE_DB, 'shared_scouting_sheets', docSnapshot.id));
                } else {
                  // if other users, assign the ownerID to one of them
                  await updateDoc(doc(FIRESTORE_DB, 'shared_scouting_sheets', docSnapshot.id), {
                    userIds: updatedUserIds,
                    'sharedSheetData.ownerID': updatedUserIds[0],  // Assign to the first user in the updated list
                  });
                }
              } else {
                // if  user is not the owner, update the userIds list
                await updateDoc(doc(FIRESTORE_DB, 'shared_scouting_sheets', docSnapshot.id), { userIds: updatedUserIds });
              }
            }
          }));
        };
  
        await removeUserFromSharedSheets();
        await deleteDoc(userDocRef);
        // delete user account from firebase
        await user.delete();
  
        Alert.alert('Account Deleted', 'Your account and related data have been deleted.');
        await handleSignOut();
      } catch (error) {
        Alert.alert('Error', 'Failed to delete account.');
        console.error("Error deleting account: ", error);
      }
    }
  };
  

  const confirmDeleteAccount = () => {
    setReauthType('delete'); // Set reauth type to 'delete'
    setModalVisible(true); // Open reauthentication modal
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Account Information</Text>

      {/* Inputs and update buttons */}
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={userName} onChangeText={setUserName} />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateName}>
        <Text style={styles.buttonText}>Update Name</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateEmail}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Modal for Reauthentication */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Re-enter Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity style={styles.resetButton} onPress={handleReauthentication}>
              <Text style={styles.resetButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.backToSignInText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Confirming Account Deletion */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Yes, Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
              <Text style={styles.backToSignInText}>No, Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#0096FF',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    marginBottom: 20,
    color: '#fff',
  },
  updateButton: {
    backgroundColor: '#0096FF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#191919',
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
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
