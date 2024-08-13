import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Pressable } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { persistentEventData, scoutingSheetArray, teamDataAtom, isSharedWithMeAtom } from '@/dataStore';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

type deleteScoutingSheetScreenProps = {
  modalVisible: boolean;
  modalIndexToDelete: number;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  
};

const DeleteScoutingSheetScreen: React.FC<deleteScoutingSheetScreenProps> = ({ modalVisible, modalIndexToDelete, setModalVisible }) => {
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const [loadedEventData, setLoadedEventData] = useAtom(persistentEventData)
  const [persistentTeamData, setPersistentTeamData] = useAtom(teamDataAtom)
  const [isSharedWithMe, setIsSharedWithMe] = useAtom(isSharedWithMeAtom)
  const db = getFirestore();
  const handleScoutingSheetDelete = () => {
    try{
      setModalVisible(!modalVisible)
      setLoadedEventData([])
      setPersistentTeamData({teamNumber : 0, extraNotes : "", intake : 5,  deposit : 5, drivetrain : 5, matchData : []})
      globalScoutingSheetArray.splice(modalIndexToDelete, 1); // 1 means you only remove one item

      // Here check conditions of sharing/ownership so we know where to delete the sheet 

      // CASE 1:
      // if isSharedWithMe = true
      // if globalScoutingSheetArray[modalIndexToDelete].isShared = true 
      // remove yourself from userIds and delete scouting sheet 

      // CASE 2:
      // if isSharedWithMe = false
      // if globalScoutingSheetArray[modalIndexToDelete].isShared = true 
      // -> map through userIds and remove the scouting sheet for each user, then delete scouting sheet 

      // CASE 3:
      // if isSharedWithMe = false
      // if globalScoutingSheetArray[modalIndexToDelete].isShared = false 
      // ->  delete scouting sheet like normal
      
      // CASE 4:
      // if isSharedWithMe = true
      // if globalScoutingSheetArray[modalIndexToDelete].isShared = false 
      // ->  CAN NEVER OCCUR

      if(FIREBASE_AUTH.currentUser){
        const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
        try {
            updateDoc(userRef, { 
                userScoutingSheetArray: globalScoutingSheetArray,
            });
        } 
        catch (error) {
            console.error("Error updating user document:", error);
        }    
      }
    } catch(error : any){
      alert('😓 Error:\n' + error.message)
    } 
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{color: 'white', fontSize: 25, marginBottom: 20}}>Delete Scouting Sheet?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.modalButton, {}]} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={[styles.resetButtonText, {color: '#1E90FF'}]}>Cancel</Text>
            </TouchableOpacity>

            <View style={{backgroundColor: 'grey', width: 1}}></View>

            <TouchableOpacity style={styles.modalButton} onPress={handleScoutingSheetDelete}>
              <Text style={[styles.resetButtonText, {color:'red'}]}>Delete</Text>
            </TouchableOpacity>
          </View>

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
    backgroundColor: '#191919',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
    paddingTop: 20,
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
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    width: '50%',
  },
  buttonContainer:{
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'grey',
    flexDirection:'row',
    justifyContent:'center'
  },
});

export default DeleteScoutingSheetScreen;
