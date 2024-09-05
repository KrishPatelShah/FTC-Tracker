import { isSharedAtom, scoutingSheetArray, sharedSheetsArrayAtom } from "@/dataStore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { User } from "firebase/auth";
import { arrayRemove, arrayUnion, collection, doc, DocumentData, getDoc, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type ShareScoutingSheetProps = {
    shareModalVisible : boolean,
    setShareModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    sheetArrayIndex : number,
}

// const userData = collection(FIRESTORE_DB, 'user_data'); // newer way of accessing a collection 

const ShareScoutingSheetModal: React.FC<ShareScoutingSheetProps> = ({shareModalVisible, setShareModalVisible, sheetArrayIndex}) => {

    // just to keep track of the textInput value
    const [textInputValue, setTextInputValue] = useState("")
    const [isShared, setIsShared] = useAtom(isSharedAtom)

    // the index of the scouting sheet the user is currently on (passed from scoutingSheetTemplate.tsx, which got the index from myScoutingSheetsScreen.tsx)
    const [sheetIndex, setSheetIndex] = useState(sheetArrayIndex)

    // accesses globalScoutingSheetArray to use sheetIndex to retrive the ID of the scouting sheet the user is currently on
    const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
    const [sharedScoutingSheetArray, setSharedScoutingSheetArray] = useAtom(sharedSheetsArrayAtom)
    console.log("Index of Scouting Sheet Selected:" + sheetArrayIndex)   
    console.log("globalScoutingSheetArray: " + globalScoutingSheetArray)    
      
    // If the scouting sheet the user is currently on is shared with someone else, fetch the sheetID from the sharedScoutingSheetArray 
    // Switched from isSharedWithMe -> isShared because the the owner's sheet still needs to update in the shared scouting sheets collection 
    const [sheetID, setSheetID] = isShared ? useState(sharedScoutingSheetArray[sheetArrayIndex].sheetID) : useState(globalScoutingSheetArray[sheetArrayIndex].sheetID)

    type firestoreUser = {
      name: string,
      email: string,
      id: string
    } 
    const [users, setUsers] = useState<firestoreUser[]>([]);


    useEffect(() => {
      if (textInputValue.length > 0) {
          const q = query(
              collection(FIRESTORE_DB, 'user_data'),
              where('email', '>=', textInputValue),
              where('email', '<=', textInputValue + '\uf8ff')
          );
  
          const unsubscribe = onSnapshot(q, (snapshot: { docs: any[] }) => {
              const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setUsers(usersData); // doesn't this need to append usersData, not SET usersData? I think this is why the sharing modal is only displaying one email
            });
  
          return () => unsubscribe();

      } else {
        setUsers([]);
      }
    }, [textInputValue]);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
            setShareModalVisible(!shareModalVisible);
        }}
        >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <Text style={{color: 'white', fontSize: 25, marginBottom: 20}}>Share Scouting Sheet</Text>

                  <TextInput
                      placeholder="Recipient's email"
                      placeholderTextColor={'grey'}
                      value={textInputValue}
                      onChangeText={(text) => {setTextInputValue(text)}}
                      cursorColor={'#328aff'}
                      autoCapitalize="none"
                      style = {styles.textInput}
                  />

                  <FlatList
                      style = {styles.searchResults}
                      data={users}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toLocaleString()}
                      renderItem={({ item }) => (
                      <TouchableOpacity style={styles.userSearchResult}onPress={() => {shareScoutingSheet(sheetID, sheetIndex, item.id)}}>   
                          <Text style = {{fontSize: 18, color:'white', padding: 10,}}>{item.email}</Text>
                      </TouchableOpacity>
                      )}
                  />
                        
                  <View style={{justifyContent:'center', flexDirection:'row', paddingTop: 20, paddingBottom: 15}}>
                      <TouchableOpacity style={[styles.cancelButton, {}]} onPress={() => setShareModalVisible(!shareModalVisible)}>
                          <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>    
                  </View>       
              </View>
          </View>
      </Modal>
    )
}

const shareScoutingSheet = async (sheetID: string, sheetIndex: number, recipientUserId: string) => {
    if(FIREBASE_AUTH.currentUser){
        const userRef = doc(FIRESTORE_DB, 'user_data', FIREBASE_AUTH.currentUser.uid);
        const recipientRef = doc(FIRESTORE_DB, 'user_data', recipientUserId);
        const sharedSheetRef = doc(FIRESTORE_DB, 'shared_scouting_sheets', sheetID); // if isShared = false, sharedSheetRef won't exist

        try {
          const userDoc = await getDoc(userRef);
          const sharedDoc = await getDoc(sharedSheetRef);

          // this line would need to change. If a user tries to share a scouting sheet that's already shared with them (isShare = true and owner id doesn't match), 
          // userSheetData would have to be set to the data stored in the shared_scouting_sheets collection, NOT the local data
          const userSheetData = await userDoc?.data()?.userScoutingSheetArray[sheetIndex]; 

          const sharedSheetDoc = sharedDoc.exists()? 
            await updateDoc(
                sharedSheetRef,{
                sharedSheetData: userSheetData,
                userIds: arrayUnion(FIREBASE_AUTH.currentUser.uid, recipientUserId) // merges array elements (no duplication)
                }
            )
          :
            await setDoc(
                sharedSheetRef, {
                sharedSheetData: userSheetData,
                userIds: [FIREBASE_AUTH.currentUser.uid, recipientUserId]
            });

          // updates the recipient's personal sharedSheets array 
          await updateDoc(recipientRef, {
            sharedSheets: arrayUnion(sheetID),
          });

          // would also have to update the current user's shared sheet IDs (this way they render in myScoutingSheetsScreen screen)
          // would have to remove the scouting sheet from the user's personal userScoutingSheetArray; this effectively "moves" the scouting sheet
        } 
        catch (error) {
          console.error("😓 Error:", error);
        }
    }
};

export default ShareScoutingSheetModal

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // adjusts opacity to dull
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
    },
    buttonText: {
      color: '#1E90FF',
      fontSize: 20,
      padding: 10,
      textAlign: 'center',
    },
    cancelButton: {
      width: '30%',
    },
    textInput:{
        width: '80%',
        borderBottomColor:'grey', 
        fontSize: 18,
        color:'white',
        borderBottomWidth: 2, 
    },
    searchResults:{
        flexDirection: 'column',
        marginTop: 20,
        width: '90%',
        height: '20%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
    },
    userSearchResult:{
        width: '80%', 
        backgroundColor:'#1E90FF', 
        alignSelf:'center',
        borderRadius: 6,
        marginTop: 10
    }
  });
  
