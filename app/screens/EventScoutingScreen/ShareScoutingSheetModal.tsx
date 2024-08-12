import { scoutingSheetArray } from "@/dataStore";
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
    sheetArrayIndex : number
}

const userData = collection(FIRESTORE_DB, 'user_data'); // newer way of accessing a collection 

const ShareScoutingSheetModal: React.FC<ShareScoutingSheetProps> = ({shareModalVisible, setShareModalVisible, sheetArrayIndex}) => {

    // just to keep track of the textInput value
    const [textInputValue, setTextInputValue] = useState("")

    // the index of the scouting sheet the user is currently on (passed from scoutingSheetTemplate.tsx, which got the index from myScoutingSheetsScreen.tsx)
    const [sheetIndex, setSheetIndex] = useState(sheetArrayIndex)

    // accesses globalScoutingSheetArray to use sheetIndex to retrive the ID of the scouting sheet the user is currently on
    const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)        
    const [sheetID, setSheetID] = useState(globalScoutingSheetArray[sheetArrayIndex].sheetID)

    //const [recipientUserID, setRecipientUserID] = useState("dX3icSA3Ytey4ac0QZ9HVjhRL5q2") // Abhilash's userID
        // should be queried and displayed in dropdown like event search 
        // call setRecicpientUserID right after the user clicks on whoever they want to share with 

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
                setUsers(usersData);
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
                        <TouchableOpacity style={styles.userSearchResult}onPress={() => {console.log(item.id), shareScoutingSheet(sheetID, sheetIndex, item.id)}}>
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

// Function to share a scouting sheet
const shareScoutingSheet = async (sheetID: string, sheetIndex: number, recipientUserId: string) => {
    if(FIREBASE_AUTH.currentUser){
        const userRef = doc(FIRESTORE_DB, 'user_data', FIREBASE_AUTH.currentUser.uid);
        const recipientRef = doc(FIRESTORE_DB, 'user_data', recipientUserId);
        const sharedSheetRef = doc(FIRESTORE_DB, 'shared_scouting_sheets', sheetID);

        try {
          const userDoc = await getDoc(userRef);
          const sharedDoc = await getDoc(sharedSheetRef);

          const userSheetData = await userDoc?.data()?.userScoutingSheetArray[sheetIndex]; 

          const sharedSheetDoc = sharedDoc.exists()? 
            await updateDoc(
                sharedSheetRef,{
                sharedSheetData: userSheetData,
                userIds: arrayUnion(FIREBASE_AUTH.currentUser.uid, recipientUserId)
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
            sharedSheets: arrayUnion(sheetID)
          });
        } 
        catch (error) {
          console.error("😓 Error:", error);
        }
    }
};

const listenForUpdates = async (sheetID: string, updateCallback: (arg0: any) => void) => {
    // I'm p sure that when you share a scouting sheet, your userRef would have to change to sharedSheetRef to trigger this listener
    // when you update your scouting sheet 

    // I think we might also need a collection variable. This way, if you "unshare" a scouting sheet, we just switch these variables
    // and it should change which collection in the db you write to depending on if the sheet is shared 

    // onSnapshot returns a function (unsubscribe) that, when called, detaches the listener and stops receiving updates.
    // listenForUpdates(sheetID, updateCallback): This returns the unsubscribe function.
        // so we have to declare something like const unsubscribe = listenForUpdates(sheetID, updateCallback); and then unsubscribe();
        // The unsubscribe function does not run automatically; it must be invoked manually.

    const sharedSheetRef = doc(FIRESTORE_DB, 'shared_scouting_sheets', sheetID);

    // Listen for changes in the document
    const unsubscribe = onSnapshot(sharedSheetRef, (doc) => {
        if (doc.exists()) {
            updateCallback(doc.data());
        } else {
            console.error('Document does not exist!');
        }
    }, (error) => {
        console.error('Error listening to document: ', error);
    });

  return unsubscribe;
};

const updateCallback = () =>{
    // funny merge time 
}

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
  
