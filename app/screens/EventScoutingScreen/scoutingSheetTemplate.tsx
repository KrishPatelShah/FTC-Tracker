import React, { useCallback, useEffect, useState, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { global_styles } from '@/styles';
import { useSelector } from 'react-redux';
import TeamView from '@/app/screens/EventScoutingScreen/teamScoutingView';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { atom, useAtom } from 'jotai'
import { eventCodeAtom, persistentEventData, teamDataAtom, scoutingSheetArray, isSharedAtom, sharedSheetsArrayAtom } from '@/dataStore';
import { TeamEventData } from '../TeamScoutingScreen/teamView';
import { useFocusEffect } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import ShareScoutingSheetModal from '../EventScoutingScreen/ShareScoutingSheetModal';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/app/navigation/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/FirebaseConfig';


type ScoutingSheetProps = {
  navigation: any;
  route: RouteProp<RootStackParamList, 'EventScoutingScreen'>;
};

type Team = {
  id: string,
  name: string,
  tot_opr: string,
  auto_opr: string,
  rank: string,
};

const EventScoutingScreen: React.FC<ScoutingSheetProps> = ({navigation, route}) => {
  const scoutingSheetArrayIndex = route.params?.scoutingSheetArrayIndex
  console.log("scoutingSheetArrayIndex: " + scoutingSheetArrayIndex)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [eventName, setEventName] = useState("");
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const [eventData, setEventData] = useAtom(persistentEventData)
  const [isShared, setIsShared] = useAtom(isSharedAtom)
  const [eventCodeJotai, setEventCodeAtom] = useAtom(eventCodeAtom)
  const [displayStats, setDisplayStats] = useState("TOTAL");
  const [stats, setStats] = useState("TOTAL");
  const [globalSharedSheetsArray, setGlobalSharedSheetsArray] = useAtom(sharedSheetsArrayAtom)
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const [persistentTeamData, setPersistentTeamData] = useAtom(teamDataAtom)
  const data = [
    { label: "AUTO", value: "AUTO" },
    { label: "TOTAL", value: "TOTAL" },
    {label : "RANK", value: "RANK"}
  ];
  useEffect(() => {
    let storedTeamArray: number[] = []
    eventData.map((item) => {storedTeamArray.push(item.teamNumber)})
    if(storedTeamArray.indexOf(persistentTeamData.teamNumber) < 0){
      eventData.push(persistentTeamData)
    }
  }, [persistentTeamData])

  
  // add useEffect to initialize listener for shared scouting sheet
  // we currently only check for changes while in teamview
//   useEffect(() => {
//     if(isShared){ 
//         listenForUpdates(globalSharedSheetsArray[scoutingSheetArrayIndex].sheetID, updateCallback)
//     }
//   }, [])

// const listenForUpdates = async (sheetID: string, updateCallback: (arg0: any) => void) => {
//     const sharedSheetRef = doc(FIRESTORE_DB, 'shared_scouting_sheets', sheetID);

//     // Listen for changes in the document
//     const unsubscribe = onSnapshot(sharedSheetRef, (doc) => {
//         if (doc.exists()) {
//             updateCallback(doc.data());
//         } else {
//             //console.error('Document does not exist or has been deleted!');
//         }
//     }, (error) => {
//         console.error('Error listening to document: ', error);
//     });

//   return unsubscribe;
// };
// const updateCallback = (docData : any) =>{
//   // funny merge time 
//   console.log("docData: ", docData)
// }

  useEffect(() => {
    const fetchEventData = async () => {
      if (eventCodeJotai) {
          const query = `
          query getEventByCode($season: Int!, $code: String!) {
            eventByCode(season: $season, code: $code) {
              name
              teams {
                team {
                  number
                  name
                }
                stats {
                    ... on TeamEventStats2023{
                        opr {
                            totalPointsNp
                            autoPoints
                        }
                        rank
                    }
                }
              }
            }
          }`;
        
        const response = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query, variables: { season: 2023, code: eventCodeJotai } })
        });
        const data = await response.json();
        //console.log(data.data.eventByCode.teams)
        let teamArray = data.data.eventByCode.teams;
        let formattedTeamArray: Team[] = [];
        teamArray.map((team: any) => {
          let opr: string = team.stats?.opr?.totalPointsNp ?? "0.000000";
          let auto_opr: string = team.stats?.opr?.autoPoints ?? "0.000000"
          let rank = team.stats?.rank ?? 999
          auto_opr = Number(auto_opr).toFixed(2)
          opr = Number(opr).toFixed(2)
          formattedTeamArray.push({ id: team.team.number, name: team.team.name, tot_opr: opr, auto_opr: auto_opr, rank: rank });
        });
        setTeamArray(formattedTeamArray);
        setEventName(data.data.eventByCode.name);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchEventData();
    });

    return unsubscribe;
  }, [navigation, eventCodeJotai]);


  const logEventData = () => {
    console.log(eventData)
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.screen}>
        <Text style={styles.eventName}>{eventName}</Text>
        <View style={styles.headerContainer}>
          <Text style={styles.headings}>Teams</Text>
          <TouchableOpacity onPress={logEventData}> 
             <Text style = {{color : "white", fontSize : 22}}> Log </Text> 
          </TouchableOpacity>
          <Dropdown
            style={styles.dropdown}
            placeholder={displayStats}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.placeholderText}
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setStats(item.value);
              setDisplayStats(item.value);
            }}
          />
        </View>
        <ScrollView style={styles.teamScroller} contentContainerStyle={styles.teamScrollerContainer}>
          {stats == "AUTO" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(b.auto_opr) - Number(a.auto_opr)).map((team) => (
            <TeamView teamName={team.name} teamNumber={team.id} shownValue={team.auto_opr} key={team.id} navigation={navigation} selectedScoutingSheetIndex={scoutingSheetArrayIndex}/>
          ))}
          {stats == "TOTAL" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(b.tot_opr) - Number(a.tot_opr)).map((team) => (
            <TeamView teamName={team.name} teamNumber={team.id} shownValue={team.tot_opr} key={team.id} navigation={navigation} selectedScoutingSheetIndex={scoutingSheetArrayIndex}/>
          ))}
          {stats == "RANK" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(a.rank) - Number(b.rank)).map((team) => (
            <TeamView teamName={team.name} teamNumber={team.id} shownValue={team.rank} key={team.id} navigation={navigation} selectedScoutingSheetIndex={scoutingSheetArrayIndex}/>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={()=>{setShareModalVisible(true)}}>
          <Ionicons name="share-social-outline" size={30} color="#328AFF" style={{marginTop: '10%'}} />
        </TouchableOpacity>
        <ShareScoutingSheetModal shareModalVisible={shareModalVisible} setShareModalVisible={setShareModalVisible} sheetArrayIndex={scoutingSheetArrayIndex}/>
        
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#101010",
    justifyContent: "flex-start",
    padding: 20,
    alignItems: "center"
  },
  eventName: {
    paddingTop: 60,
    color: "white",
    fontSize: 32
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    justifyContent: 'space-between'
  },
  headings: {
    color: "white",
    fontSize: 22
  },
  teamScroller: {
    display: "flex",
    flexDirection: "column",
    top: 20,
    height: 540,
    width: 360,
    flexGrow: 0,
    backgroundColor: "#328AFF",
    borderRadius: 10
  },
  teamScrollerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    width: 120,
    padding : 6
  },
  placeholderText: {
    color: "white"
  },
});

export default EventScoutingScreen;