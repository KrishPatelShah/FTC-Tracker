import { getFirestore, doc, setDoc, getDoc, DocumentData, addDoc, updateDoc, onSnapshot, collection, arrayUnion } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_APP} from "@/FirebaseConfig";


const db = getFirestore();
const firestore = FIRESTORE_DB;
const firebase = FIREBASE_APP;

const userData = collection(db, 'user_data'); // newer way of accessing a collection 


// Function to share a scouting sheet
const shareScoutingSheet = async (sheetID: string, sheetIndex: string | number, recipientUserId: string) => {
    if(FIREBASE_AUTH.currentUser){
        const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
        const recipientRef = doc(db, 'user_data', recipientUserId);
        const sharedSheetRef = doc(db, 'shared_scouting_sheets', sheetID);

        try {
          const userDoc = await getDoc(userRef);
          const sheetData = await userDoc?.data()?.scoutingSheetArray[sheetIndex]; // I think this is how it works 

          const sharedSheetDoc = await setDoc(
            sharedSheetRef, {
            sharedSheetData: sheetData,
            userIds: [FIREBASE_AUTH.currentUser.uid, recipientUserId]
          });

          await updateDoc(recipientRef, {
            // append sheetID to the recipients personal sharedSheets array 
            // this gives them a way to actually access the scouting sheet that was just shared with them
            sharedSheets: arrayUnion(sheetID)
          });
        } 
        catch (error) {
          console.error("😓 Error:", error);
        }
    }
};

// Function to listen for real-time updates
const listenForUpdates = async (sheetID:string, updateCallback: (arg0: any) => void) => {
    // I'm p sure that when you share a scouting sheet, your userRef would have to change to sharedSheetRef to trigger this listener
    // when you update your scouting sheet 

    // I think we might also need a collection variable. This way, if you "unshare" a scouting sheet, we just switch these variables
    // and it should change which collection in the db you write to depending on if the sheet is shared 

    const sharedSheetRef = doc(db, 'shared_scouting_sheets', sheetID);

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
    
    

}