import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { arrayRemove, doc, DocumentData, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BookmarkType } from "./homeScreen";

type DeleteBookmarkProps = {
    modalVisible : boolean,
    bookmarkToDelete : BookmarkType,
    setModalVisible : (payload: boolean) => void,
    updateBookmarks : (payload: BookmarkType[]) => void
}

const DeleteBookmark: React.FC<DeleteBookmarkProps> = ({modalVisible, bookmarkToDelete, setModalVisible, updateBookmarks}) => {

    const db = getFirestore();

    console.log(bookmarkToDelete)

    const handleBookmarkDelete = async () => {
        try{
            setModalVisible(!modalVisible)
            //console.log(codeToDelete)
      
            if(FIREBASE_AUTH.currentUser){
              const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
              try {
                  updateDoc(userRef, { 
                      bookmarks : arrayRemove(bookmarkToDelete)
                  });
              } 
              catch (error) {
                  console.error("Error updating user document:", error);
              }
              const docSnap = await getDoc(userRef);
                if (docSnap) {
                    const userData = docSnap.data() as DocumentData 
                    console.log("set");
                    updateBookmarks(userData.bookmarks)
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
          <Text style={{color: 'white', fontSize: 25, marginBottom: 20}}>Delete Bookmark?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.modalButton, {}]} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={[styles.resetButtonText, {color: '#1E90FF'}]}>Cancel</Text>
            </TouchableOpacity>

            <View style={{backgroundColor: 'grey', width: 1}}></View>

            <TouchableOpacity style={styles.modalButton} onPress={handleBookmarkDelete}>
              <Text style={[styles.resetButtonText, {color:'red'}]}>Delete</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
    )
}

export default DeleteBookmark

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
  
