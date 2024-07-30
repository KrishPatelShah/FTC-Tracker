import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '@/FirebaseConfig'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Linking, ActivityIndicator } from 'react-native';
import { doc, getFirestore, setDoc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/app/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { eventCodeAtom, persistentEventData, scoutingSheetArray, ScoutingSheetArrayType } from '@/dataStore';
import { useAtom } from 'jotai';

type MyScoutingSheetsScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const MyScoutingSheetsScreen: React.FC<MyScoutingSheetsScreenProps> = ({navigation}) => {

  const [eventData, setEventData] = useAtom(persistentEventData)
  const [eventCodeJotai, setEventCode] = useAtom(eventCodeAtom)
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const db = getFirestore();

  const fetchFirebaseData = async ()=>{
    if(FIREBASE_AUTH.currentUser){
      const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);

      try {
        const docSnap = await getDoc(userRef);
          if (docSnap) {
            const userData = docSnap.data() as DocumentData 

            setGlobalScoutingSheetArray(userData.userScoutingSheetArray);
          } 
      } 
      catch (error) {
        console.error("😓 Error retrieving document:", error);
      }

    }
  }
  useEffect( () => {
    fetchFirebaseData()
  }, [])
 
  // let globalScoutingSheetArray: ScoutingSheetArrayType[] = firebase.fetch().map((item) => JSON.parse(item))

  const run: (arg0: ScoutingSheetArrayType) => void = (item) => {
    setEventCode(item.code)
    setEventData(item.eventData)
    navigation.navigate("EventScoutingScreen")
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>
            My Scouting Sheets
        </Text>

        <View style={{width: '80%', height: '0.25%', marginBottom: '-1%', backgroundColor:'#328AFF', borderRadius: 10}}/>

        {globalScoutingSheetArray.map((item, index) => (
          <TouchableOpacity style = {styles.button} key = {index} onPress = {() => run(item)}>
            <Ionicons name="calendar-outline" size={35} color="#328AFF" style={styles.icon} />
            <View style={styles.buttonTextContainer}>
              <Text numberOfLines={1} style={styles.buttonText}>{item.name}</Text>
              <Text numberOfLines={1} style={{fontSize: 15, color:'grey', alignSelf: 'flex-start'}}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        ))} 

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
    alignItems:'center',
    justifyContent: 'flex-start',
  },
  title:{
    color:'white',
    fontSize: 40,
    marginBottom:'4%',
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
    fontSize: 24,

  },
  icon: {
    padding: 14,
  },
});

export default MyScoutingSheetsScreen;
