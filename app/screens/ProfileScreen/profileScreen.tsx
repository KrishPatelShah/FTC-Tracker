import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../../FirebaseConfig';
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';

const ProfileScreen = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [reauthModalVisible, setReauthModalVisible] = useState<boolean>(false); // For reauth modal
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false); // For delete confirmation modal
  const [reauthType, setReauthType] = useState<'email' | 'password' | null>(null); 
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
    setReauthType('email');
    setReauthModalVisible(true); // Show modal for reauth
  };

  const handleUpdatePassword = async () => {
    setReauthType('password');
    setReauthModalVisible(true); // Show modal for reauth
  };

  const handleReauthentication = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const isReauthenticated = await reauthenticateUser();
      if (isReauthenticated) {
        setReauthModalVisible(false); // Close reauth modal
        if (reauthType === 'email') {
          try {
            await updateEmail(user, userEmail);
            const userDocRef = doc(FIRESTORE_DB, 'user_data', user.uid);
            await updateDoc(userDocRef, { email: userEmail });
            Alert.alert("Success", "Email updated successfully.");
          } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert("Error", "The email address is already in use by another account.");
            } else if (error.code === 'auth/invalid-email') {
              Alert.alert("Error", "The email address is not valid.");
            } else {
              Alert.alert("Error", "Failed to update email.");
            }
          }
        } else if (reauthType === 'password') {
          try {
            await updatePassword(user, newPassword);
            Alert.alert("Success", "Password updated successfully.");
          } catch (error) {
            Alert.alert("Error", "Failed to update password.");
          }
        }
        setCurrentPassword(''); // Clear the current password field after reauth
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'user_data', user.uid);
        await deleteDoc(userDocRef);
        await user.delete();
        Alert.alert('Account Deleted', 'Your account has been deleted.');
        FIREBASE_AUTH.signOut();
      } catch (error) {
        Alert.alert('Error', 'Failed to delete account.');
      }
    }
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(true); // Show delete confirmation modal
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header}>Account Information</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
      />

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

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
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
              <TouchableOpacity style={styles.modalButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Reauthentication */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reauthModalVisible}
        onRequestClose={() => {
          setReauthModalVisible(!reauthModalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Re-enter Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current Password"
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleReauthentication}>
            <Text style={styles.modalButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setReauthModalVisible(false)}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#0096FF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtonCancel: {
    backgroundColor: '#ff3b30',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  modalButtonText: {
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
