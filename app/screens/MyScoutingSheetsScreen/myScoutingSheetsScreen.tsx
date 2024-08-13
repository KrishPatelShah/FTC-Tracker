import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '@/FirebaseConfig'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Linking, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { doc, getFirestore, setDoc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '@/app/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { eventCodeAtom, persistentEventData, scoutingSheetArray, ScoutingSheetArrayType, isSharedWithMeAtom, sharedSheetsArrayAtom } from '@/dataStore';
import { useAtom } from 'jotai';
import DeleteScoutingSheetScreen from '../MyScoutingSheetsScreen/deleteScoutingSheetScreen';


type MyScoutingSheetsScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const MyScoutingSheetsScreen: React.FC<MyScoutingSheetsScreenProps> = ({navigation}) => {

  const [eventData, setEventData] = useAtom(persistentEventData)
  const [eventCodeJotai, setEventCode] = useAtom(eventCodeAtom)
  const [globalSharedSheetsArray, setGlobalSharedSheetsArray] = useAtom(sharedSheetsArrayAtom)

  const [isSharedWithMe, setIsSharedWithMe] = useAtom(isSharedWithMeAtom)
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const [mySharedSheetIDs, setMySharedSheetIDs] = useState<string[]>()
  const db = getFirestore();

  const [modalVisible, setModalVisible] = useState(false);
  // const [isSharedWithMe, setIsSharedWithMe] = useState(false);
  const [modalIndexToDelete, setModalIndexToDelete] = useState(0);

  const handleLongPress = (scoutingSheetArrayIndex : number, isSharedWithMe : boolean) => {
    setModalIndexToDelete(scoutingSheetArrayIndex)
    setIsSharedWithMe(isSharedWithMe);
    setModalVisible(true)
  }

  const tempSharedSheetArray: ScoutingSheetArrayType[] = []

  const fetchUserFirebaseData = async ()=>{
    if(FIREBASE_AUTH.currentUser){
      const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);

      try {
        const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data() as DocumentData 
            setMySharedSheetIDs(userData.sharedSheets)
            setGlobalScoutingSheetArray(userData.userScoutingSheetArray);
          } 
      } 
      catch (error) {
        console.error("😓 Error retrieving document:", error);
      }

    }
  }

  const fetchSharedData = async () => {
    if (FIREBASE_AUTH.currentUser && mySharedSheetIDs) {
      try {
        const sharedDataPromises = mySharedSheetIDs.map(async (item) => {
          const sharedRef = doc(db, 'shared_scouting_sheets', item);
          const docSnap = await getDoc(sharedRef);
          if (docSnap.exists()) {
            return docSnap.data().sharedSheetData as ScoutingSheetArrayType;
          }
          return null;
        });
  
        const sharedDataArray = await Promise.all(sharedDataPromises);
  
        // Filter out any null values (in case some docs didn't exist)
        const validSharedData = sharedDataArray.filter(data => data !== null) as ScoutingSheetArrayType[];
        setGlobalSharedSheetsArray(validSharedData);
      } catch (error) {
        console.error("😓 Error retrieving shared data:", error);
      }
    }
  };

  useEffect( () => {
    fetchUserFirebaseData()
  }, [])

  useEffect(()=>{
    fetchSharedData()
  }, [mySharedSheetIDs])

  const run: (arg0: ScoutingSheetArrayType, scoutingSheetArrayIndex : number, isSharedWithMe : boolean) => void = (item, scoutingSheetArrayIndex, isSharedWithMe) => {
    setEventCode(item.code)
    setEventData(item.eventData)
    setIsSharedWithMe(isSharedWithMe)
    console.log("Clicked")
    //console.log("")
    console.log("scoutingSheetArrayIndex: ", scoutingSheetArrayIndex)
    navigation.navigate("EventScoutingScreen", {scoutingSheetArrayIndex})
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>
            My Scouting Sheets
        </Text>

        <View style={{width: '85%', height: '0.25%', marginBottom: '-1%', backgroundColor:'#328AFF', borderRadius: 10}}/>

        {
          globalScoutingSheetArray?.map((item, scoutingSheetArrayIndex) => (
          <TouchableOpacity style = {styles.button} key = {scoutingSheetArrayIndex} onPress = {() => run(item, scoutingSheetArrayIndex, false)} onLongPress={() => handleLongPress(scoutingSheetArrayIndex, false)} delayLongPress={300}>
            <Ionicons name="calendar-outline" size={30} color="#328AFF" style={styles.icon}/>
            <View style={styles.buttonTextContainer}>
              <Text numberOfLines={1} style={styles.buttonText}>{item.name}</Text>
              <Text numberOfLines={1} style={{fontSize: 15, color:'grey', alignSelf: 'flex-start'}}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.title, {fontSize: 30, marginTop:'5%',}]}>
            Shared with Me
        </Text>

        <View style={{width: '55%', height: '0.25%', marginBottom: '-1%', backgroundColor:'#328AFF', borderRadius: 10}}/>

        {
          globalSharedSheetsArray?.map((item, sharedSheetArrayIndex) => (
            <TouchableOpacity style = {styles.button} key = {sharedSheetArrayIndex} onPress = {() => run(item, sharedSheetArrayIndex, true)} onLongPress={() => handleLongPress(sharedSheetArrayIndex, true)} delayLongPress={300}>
              <Ionicons name="calendar-outline" size={30} color="#328AFF" style={styles.icon}/>
              <View style={styles.buttonTextContainer}>
                <Text numberOfLines={1} style={styles.buttonText}>{item.name}</Text>
                <Text numberOfLines={1} style={{fontSize: 15, color:'grey', alignSelf: 'flex-start'}}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))
        }

        <DeleteScoutingSheetScreen modalVisible={modalVisible} setModalVisible={setModalVisible} modalIndexToDelete={modalIndexToDelete}/>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems : "center",
    backgroundColor: '#101010',
    paddingTop: 110,
    flex : 1
  },
  buttonTextContainer:{
    flexDirection: 'column',
    justifyContent:'center',
    flex: 1,
    paddingRight: 20,
  },
  title:{
    color:'white',
    fontSize: 40,
    marginBottom:'2%',
    marginTop: '2%',
    
  },
  button:{
    backgroundColor: '#191919',
    borderRadius: 10,
    marginTop:'5%',
    flexDirection: "row",
    alignItems: "center",
    width: '90%',
    height: '10%',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  icon: {
    padding: 14,
  },
});

export default MyScoutingSheetsScreen;
