import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native'; 
import { useAtom } from 'jotai';
import { persistentEventData, scoutingSheetArray, teamDataAtom, isSharedAtom, sharedSheetsArrayAtom, ScoutingSheetArrayType } from '@/dataStore';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

type deleteScoutingSheetScreenProps = {
  modalVisible: boolean;
  modalIndexToDelete: number;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteScoutingSheetScreen: React.FC<deleteScoutingSheetScreenProps> = ({ modalVisible, modalIndexToDelete, setModalVisible}) => {
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const [globalSharedSheetsArray, setGlobalSharedSheetsArray] = useAtom(sharedSheetsArrayAtom)
  const [loadedEventData, setLoadedEventData] = useAtom(persistentEventData)
  const [persistentTeamData, setPersistentTeamData] = useAtom(teamDataAtom)
  const [isShared, setIsShared] = useAtom(isSharedAtom)
  const [userIDs, setUserIDs] = useState<string[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const db = getFirestore();
  const currentUserID = FIREBASE_AUTH.currentUser?.uid

  // Same two methods as in ShareScoutingSheetModal.tsx:
  const [sheetID, setSheetID] = useState(() => {
    return isShared
        ? globalSharedSheetsArray[modalIndexToDelete]?.sheetID || ''
        : globalScoutingSheetArray[modalIndexToDelete]?.sheetID || ''
  });

  const [sheetOwnerID, setSheetOwnerID] = useState(() => {
    return isShared
        ? globalSharedSheetsArray[modalIndexToDelete]?.ownerID || ''
        : globalScoutingSheetArray[modalIndexToDelete]?.ownerID || ''
  });

  // Have to fetch userIDs from firestore directly since it doesn't exist in globalSharedSheetsArray
  useEffect(() => {
    const fetchUserIDs = async () => {
      if (isShared) {
        try {
          const docRef = doc(db, "shared_scouting_sheets", sheetID); 
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().userIds) {
            setUserIDs(docSnap.data().userIds);
          } else {
            console.log("Document does not exist or doesn't have userIDs.");
            setUserIDs([]);
          }
        } 
        catch (error) {
          console.error("Error fetching document: ", error);
          setUserIDs([]);
        }
      } 
      else {
      setUserIDs([]);
      }

      setAppLoading(false);
    };

    fetchUserIDs();
  }, []);

  // Deletes a specified document in firestore under the shared_sheets_collection
  async function deleteDocument(docId: string) {
    try {
        await deleteDoc(doc(db, "shared_scouting_sheets", docId));
        alert("Scouting sheet successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
  }
 
  // DIAGNOSTICS:
  // console.log("\n\ncurrent userID: " + currentUserID + "\nmodal index to delete: " + modalIndexToDelete + "\nisShared?: " + isShared + "\nsheetID: " + sheetID)
  // if(isShared){
  //   console.log("\nis shared! ownerId: " + globalSharedSheetsArray[modalIndexToDelete]?.ownerID)
  //   console.log("\nis shared! userIDs: " + userIDs)
  // }else{
  //   console.log("\nis not shared! ownerId: " + globalScoutingSheetArray[modalIndexToDelete]?.ownerID)
  // }

  const handleScoutingSheetDelete = () => {
    try{
      setModalVisible(!modalVisible)
      setLoadedEventData([])
      setPersistentTeamData({teamNumber : 0, extraNotes : "", intake : 5,  deposit : 5, drivetrain : 5, matchData : []})

      // CASE 1:
      // -> map through userIDs and remove the scouting sheet for each user, then delete scouting sheet
      if(sheetOwnerID == currentUserID && isShared){
        console.log("Deleting scouting sheets for everyone!")

        const removeSheetFromUsers = async () => {
          await Promise.all(userIDs.map(async (userID) => {
            try {
              // Fetch the user document
              const userDocRef = doc(db, "user_data", userID);
              const userDocSnap = await getDoc(userDocRef);
    
              if (userDocSnap.exists()) {
                // Get the sharedSheets array
                const userData = userDocSnap.data();
                let sharedSheets = userData.sharedSheets || [];
    
                // Remove the sheetID from sharedSheets
                sharedSheets = sharedSheets.filter((id: string) => id !== sheetID);
    
                // Update the user document with the modified sharedSheets array
                await updateDoc(userDocRef, { sharedSheets });
    
              } else {
                console.log(`User document for userID ${userID} does not exist.`);
              }
            } catch (error) {
              console.error(`Error updating sharedSheets for userID ${userID}: `, error);
            }
          }));
        };
    
        if (userIDs.length > 0) {
          removeSheetFromUsers();
        }

        // finally, delete document on firestore
        deleteDocument(globalSharedSheetsArray[modalIndexToDelete].sheetID)
        globalSharedSheetsArray.splice(modalIndexToDelete, 1); // 1 means you only remove one item
      }

      // CASE 2:
      // ->  delete scouting sheet from user_data collection
      if(sheetOwnerID == currentUserID && !isShared){
        console.log("Deleting your local scouting sheet!")
        globalScoutingSheetArray.splice(modalIndexToDelete, 1); // 1 means you only remove one item

        // Push all changes to firestore 
        if(FIREBASE_AUTH.currentUser){
          const userRef = doc(db, 'user_data', currentUserID);
          try {
              updateDoc(userRef, { 
                  userScoutingSheetArray: globalScoutingSheetArray, // gonna have to change based on whether isShared
              });
              alert("Scouting sheet successfully deleted!");
          } 
          catch (error) {
              console.error("Error updating user document:", error);
          }    
        }
      }

      // CASE 3:
      // -> remove yourself from userIds under a document in shared_scouting_sheets collection 
      if(sheetOwnerID != currentUserID && isShared && currentUserID){
        console.log("removing you from userIDs in a document under shared_scouting_sheets collection!")

        const removeFromSharedSheets = async () => {
          // Fetch the user document
          const userDocRef = doc(db, "user_data", currentUserID);
          const userDocSnap = await getDoc(userDocRef);
      
          if (userDocSnap.exists()) {
            // Get the sharedSheets array
            const userData = userDocSnap.data();
            let sharedSheets = userData.sharedSheets || [];
      
            // Remove the sheetID from sharedSheets
            sharedSheets = sharedSheets.filter((id: string) => id !== sheetID);
      
            // Update the user document with the modified sharedSheets array
            await updateDoc(userDocRef, { sharedSheets });
            alert("Scouting sheet successfully deleted!");
          } else {
            console.log(`User document for userID ${currentUserID} does not exist.`);
          }
        }

        const removeFromUserIDs = async () => {
          const docRef = doc(db, "shared_scouting_sheets", sheetID); 
          const filteredUserIDs = userIDs.filter((id: string) => id !== currentUserID);

          await updateDoc(docRef, {userIds : filteredUserIDs})
        }

        removeFromSharedSheets()
        removeFromUserIDs()
        globalSharedSheetsArray.splice(modalIndexToDelete, 1); 
      }

    } catch(error : any){
      alert('😓 Error deleting scouting sheet:\n' + error.message)
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
          {appLoading ?
            (<>
              <ActivityIndicator size="large" color='#fff'/>
            </>) 
            : 
            (<> 
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
          </>)
          }
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
