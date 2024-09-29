import { RootStackParamList } from "@/app/navigation/types";
import { NavigationProp, RouteProp, useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, BackHandler, ActivityIndicator, AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Slider from "@react-native-community/slider";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAtom, useAtomValue } from "jotai";
import { eventCodeAtom, teamDataAtom, teamNumberAtom, persistentEventData, scoutingSheetArray, isSharedAtom, sharedSheetsArrayAtom, ScoutingSheetArrayType } from "@/dataStore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { doc, getFirestore, updateDoc, getDoc, DocumentData, onSnapshot } from "firebase/firestore";


type HomeScreenProps = {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'TeamScoutingScreen'>;
};

  type TeamData = {
    number : string,
    name : string,
    city : string,
    state : string,
    rookieYear : string,
    school : string,
    tot_opr : string,
    auto_opr : string,
    tele_opr : string,
    eg_opr : string,
    rank : string,
    matches : Match[],
  }

  type Match = {
    matchNum : number,
    redTeams : Team[],
    blueTeams : Team[],
    blueScore : number, 
    redScore : number,
    matchType : string
    hasBeenPlayed : boolean
  }

  type Team = {
    teamNumber : number,
    teamName : string,
    alliance : string,
    onField : boolean
  }

  type TeamMatchData = {
    auto_sample_net : string,
    auto_sample_low : string,
    auto_sample_high : string,
    auto_specimen_low : string,
    auto_specimen_high : string,
    auto_park : string,
    tele_sample_net : string,
    tele_sample_low : string,
    tele_sample_high : string,
    tele_specimen_low : string,
    tele_specimen_high : string,
    endgame_park : string
  }


  export type TeamEventData = {
    teamNumber : number,
    matchData : TeamMatchData[]
    extraNotes : string,
    intake : number,
    deposit : number,
    drivetrain : number,
    park : string,
    sample_scoring : string,
    specimen_scoring : string
  }

  

  type dropdownMatches = {
    label : string,
    value : string
  }


const TeamScoutingScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
    const [DropdownMatchView, setDropdownMatch] = useState<dropdownMatches[]>([])
    const [eventCode, setEventCode] = useAtom(eventCodeAtom)
    const [teamNumber, setTeamNumber] = useAtom(teamNumberAtom)
    const [persistentTeamData, setPersistentTeamData] = useAtom(teamDataAtom)
    const [teamData, setTeamData] = useState<TeamData>({number : "", name : "", city : "", state : "", rookieYear : "", school : "", tot_opr : "", auto_opr : "", tele_opr : "", eg_opr : "", rank : "", matches : []})
    const [teamEventData, setTeamEventData] = useState<TeamEventData>({teamNumber : Number(teamNumber), extraNotes : "", intake : 5,  deposit : 5, drivetrain : 5, matchData : [], park : "", sample_scoring : "", specimen_scoring : ""})
    const loadedEventData = useAtomValue(persistentEventData)
    
    const [showingInfo, setShowingInfo] = useState(false)
    const [matchView, setMatchView] = useState("Match 1")
    const [displayMatchView, setDisplayMatchView] = useState("Match 1")

    /** 
    const [purplePixelCheck, setPurplePixelCheck] = useState("n/a")
    const [yellowPixelCheck, setYellowPixelCheck] = useState("n/a")
    const [parkCheck, setParkCheck] = useState("n/a")
    const [driveUnderStageDoorCheck, setDriveUnderStageDoorCheck] = useState("n/a")
    const [cyclesText, setCyclesText] = useState("")
    const [backDropLineText, setBackDropLineText] = useState("")
    const [mosaicText, setMosaicText] = useState("")
    const [climbCheck, setClimbCheck] = useState("n/a")
    const [droneText, setDroneText] = useState("")
    const [extraNotes, setExtraNotes] = useState("")
    */

    const [auto_sample_net_value, set_auto_sample_net] = useState("")
    const [auto_sample_low_value, set_auto_sample_low] = useState("")
    const [auto_sample_high_value, set_auto_sample_high] = useState("")
    const [auto_specimen_low_value, set_auto_specimen_low] = useState("")
    const [auto_specimen_high_value, set_auto_specimen_high] = useState("")
    const [auto_park_value, set_auto_park] = useState("")
    const [tele_sample_net_value, set_tele_sample_net] = useState("")
    const [tele_sample_low_value, set_tele_sample_low] = useState("")
    const [tele_sample_high_value, set_tele_sample_high] = useState("")
    const [tele_specimen_low_value, set_tele_specimen_low] = useState("")
    const [tele_specimen_high_value, set_tele_specimen_high] = useState("")
    const [endgame_park_value, set_endgame_park] = useState("")

    const [ascent_park, set_ascent_park] = useState("")
    const [sample_scoring, set_sample_scoring] = useState("")
    const [specimen_scoring, set_specimen_scoring] = useState("")


    const [extraNotes, setExtraNotes] = useState("")

    let auto_park_options = [{label : "Park", value : "Park"}, {label : "Level 1", value : "Level 1"}]
    let endgame_park_options = [{label : "Park", value : "Park"}, {label : "Level 1", value : "Level 1"}, {label : "Level 2", value : "Level 2"}, {label : "Level 3", value : "Level 3"}]

    let ascent_park_options = [{label : "Park", value : "Park"}, {label : "Level 1", value : "Level 1"}, {label : "Level 2", value : "Level 2"}, {label : "Level 3", value : "Level 3"}]
    let sample_scoring_options = [{label : "Net Zone", value : "Net Zone"}, {label : "Low", value : "Low"}, {label : "High", value : "High"}, {label : "All", value : "All"}]
    let specimen_scoring_options = [{label : "Low", value : "Low"}, {label : "High", value : "High"}, {label : "All", value : "All"}]

    const [intakeVal, setIntakeVal] = useState(5)
    const [depositVal, setDepositVal] = useState(5)
    const [drivetrainVal, setDrivetrainVal] = useState(5)
    const [isLoadedFromMain, setIsLoadedFromMain] = useState("false")
    
    const [dataFetched, setDataFetched] = useState(false)
    const [matchNums, setMatchNums] = useState(0)
    const [isMatchNumsFinished, setIsMatchNumsFinished] = useState(false)
    const [shouldReRender, setShouldReRender] = useState(false)

    const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
    const db = getFirestore();
    const [loading, setLoading] = useState(false)
    const [isShared, setIsShared] = useAtom(isSharedAtom)
    const [globalSharedSheetsArray, setGlobalSharedSheetsArray] = useAtom(sharedSheetsArrayAtom)
    const selectedScoutingSheetIndex = route.params?.selectedScoutingSheetIndex; 
    const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

    useEffect(() => {
        if(isShared){ 
            // Async function to handle the subscription
            const subscribeToUpdates = async () => {
                const newUnsubscribe = await listenForUpdates(globalSharedSheetsArray[selectedScoutingSheetIndex].sheetID);
                setUnsubscribe(() => newUnsubscribe); // Set the unsubscribe function
            }
            subscribeToUpdates();

            // only runs when the teamView component unmounts (aka stops being rendered)
            return () => {
                if(unsubscribe){
                    unsubscribe(); 
                }
            };
        }
    }, [])

    const listenForUpdates = async (sheetID: string) => {    
        const sharedSheetRef = doc(FIRESTORE_DB, 'shared_scouting_sheets', sheetID);
    
        // Listen for changes in the document
        const unsubscribe = onSnapshot(sharedSheetRef, (doc) => {
            if (doc.exists()) {
                const mergedSheet = mergeScoutingSheets(globalSharedSheetsArray[selectedScoutingSheetIndex], doc.data().sharedSheetData);
                globalSharedSheetsArray[selectedScoutingSheetIndex] = mergedSheet;
            } else {
                //console.error('Document does not exist or has been deleted!');
            }
        }, (error) => {
            console.error('Error listening to document: ', error);
        });
    
      return unsubscribe;
    };

    // Triggers when listener detecs an update
    const mergeScoutingSheets: (userScoutingSheet : ScoutingSheetArrayType, storedScoutingSheet : ScoutingSheetArrayType) => ScoutingSheetArrayType = (userScoutingSheet, storedScoutingSheet) => {
        type MergePair = {
            userSide : TeamEventData,
            serverSide : TeamEventData
        }

        let needToMerge: MergePair[] = []
        let mergedEventData: TeamEventData[] = []
        let allUserNumbers: number[] = userScoutingSheet.eventData.map((item) => item.teamNumber)
        let allStoredNumbers: number[] = storedScoutingSheet.eventData.map((item) => item.teamNumber)

        userScoutingSheet.eventData.map((item) => {
            if(allStoredNumbers.includes(item.teamNumber)){
                let serverData = storedScoutingSheet.eventData.filter((server) => server.teamNumber = item.teamNumber)[0]
                needToMerge.push({userSide : item, serverSide : serverData})
            } else {
                mergedEventData.push(item)
            }
        })
        storedScoutingSheet.eventData.map((item) => {
            if(!allUserNumbers.includes(item.teamNumber)){
                mergedEventData.push(item)
            }
        })

        needToMerge.map((item) => {
            let mergedMatchData = item.userSide.matchData.map((userMatch, index) => {
                let serverMatch = item.serverSide.matchData[index];
                let mergedMatch: TeamMatchData = { ...serverMatch };
    
                for (const key in userMatch) {
                    if (userMatch.hasOwnProperty(key)) {
                        const userValue = userMatch[key as keyof TeamMatchData];
                        const serverValue = serverMatch[key as keyof TeamMatchData];
    
                        if (userValue !== "" && userValue !== "n/a") {
                            mergedMatch[key as keyof TeamMatchData] = userValue;
                        } else if (serverValue) {
                            mergedMatch[key as keyof TeamMatchData] = serverValue;
                        }
                    }
                }
    
                return mergedMatch;
            });
    
            let mergedTeamData: TeamEventData = {
                teamNumber: item.userSide.teamNumber,
                matchData: mergedMatchData,
                extraNotes: item.userSide.extraNotes || item.serverSide.extraNotes,
                intake: item.userSide.intake || item.serverSide.intake,
                deposit: item.userSide.deposit || item.serverSide.deposit,
                drivetrain: item.userSide.drivetrain || item.serverSide.drivetrain,
                park: item.userSide.park || item.serverSide.park,
                sample_scoring: item.userSide.sample_scoring || item.serverSide.sample_scoring,
                specimen_scoring: item.userSide.specimen_scoring || item.serverSide.specimen_scoring
            };
    
            mergedEventData.push(mergedTeamData);
        });
    
        let mergedScoutingSheet: ScoutingSheetArrayType = {
            code: userScoutingSheet.code,
            date: userScoutingSheet.date,
            name: userScoutingSheet.name,
            sheetID: userScoutingSheet.sheetID,
            eventData: mergedEventData,
            isShared: false,
            ownerID: ""
        };
    
        return mergedScoutingSheet;
    }

    const addTeamEventDataToGlobalSharedSheets = () => {
        console.log("adding to global");
        let event:ScoutingSheetArrayType = globalSharedSheetsArray[selectedScoutingSheetIndex]
        if (event) {
            const existingTeamIndex = event.eventData.findIndex(
                (data) => data.teamNumber === teamEventData.teamNumber
            );
            if (existingTeamIndex !== -1) {
                event.eventData[existingTeamIndex] = teamEventData;
                console.log("existing team");
            } else {
                event.eventData.push(teamEventData);
                console.log("new team");
            }
        }
    };

    const addTeamEventDataToGlobalUserSheets = () => {
        console.log("adding to global");
        let event:ScoutingSheetArrayType = globalScoutingSheetArray.filter((item) => item.code == eventCode)[0];
        if (event) {
            const existingTeamIndex = event.eventData.findIndex(
                (data) => data.teamNumber === teamEventData.teamNumber
            );
            if (existingTeamIndex !== -1) {
                event.eventData[existingTeamIndex] = teamEventData;
                console.log("existing team");
            } else {
                event.eventData.push(teamEventData);
                console.log("new team");
            }
        }
    };


    useFocusEffect(
        React.useCallback(() => {
        console.log("Start")

            return () => {
                console.log("Back2")
                if(FIREBASE_AUTH.currentUser){
                    if(isShared){ //
                        const userRef = doc(db, 'shared_scouting_sheets', globalSharedSheetsArray[selectedScoutingSheetIndex].sheetID) 
                        addTeamEventDataToGlobalSharedSheets()
                        try {
                            console.log("updating in shared collection!")
                            console.log("sharedSheet ID: ", globalSharedSheetsArray[selectedScoutingSheetIndex].sheetID)
                            updateDoc(userRef, { 
                                sharedSheetData: globalSharedSheetsArray[selectedScoutingSheetIndex]
                            });
                            // unsubscribe() // might not be necessary since unsub should run when teamView unmounts
                        } 
                        catch (error) {
                            console.error("Error updating user document:", error);
                        }  
                    }else{
                        const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
                        console.log("global scouting sheet array")
                        addTeamEventDataToGlobalUserSheets()
                        try {
                            console.log("updating in local user_data collection!")
                            updateDoc(userRef, { 
                                userScoutingSheetArray: globalScoutingSheetArray,
                            });
                        } 
                        catch (error) {
                            console.error("Error updating user document:", error);
                        }  
                    } 
                }
            };
        }, [])
    )

    useEffect(() => {
        if(shouldReRender){
        console.log(teamEventData)
        setIntakeVal(teamEventData.intake)
        setDepositVal(teamEventData.deposit)
        setDrivetrainVal(teamEventData.drivetrain)
        set_auto_sample_net(teamEventData.matchData[0].auto_sample_net)
        set_auto_sample_low(teamEventData.matchData[0].auto_sample_low)
        set_auto_sample_high(teamEventData.matchData[0].auto_sample_high)
        set_auto_specimen_low(teamEventData.matchData[0].auto_specimen_low)
        set_auto_specimen_high(teamEventData.matchData[0].auto_specimen_high)
        set_auto_park(teamEventData.matchData[0].auto_park)
        set_tele_sample_net(teamEventData.matchData[0].tele_sample_net)
        set_tele_sample_low(teamEventData.matchData[0].tele_sample_low)
        set_tele_sample_high(teamEventData.matchData[0].tele_sample_high)
        set_tele_specimen_low(teamEventData.matchData[0].tele_specimen_low)
        set_tele_specimen_high(teamEventData.matchData[0].tele_specimen_high)
        set_endgame_park(teamEventData.matchData[0].endgame_park)
        }
    }, [shouldReRender])

    useEffect(() => {
        if(isLoadedFromMain === "true"){
            let loadingTeamArray = loadedEventData.filter((item) => (item.teamNumber == teamEventData.teamNumber))
            console.log()
            teamEventData.matchData = loadingTeamArray[0].matchData
            teamEventData.intake = loadingTeamArray[0].intake
            teamEventData.deposit = loadingTeamArray[0].deposit
            teamEventData.drivetrain = loadingTeamArray[0].drivetrain
            console.log("Found")
            console.log("Loading Intake : " + loadingTeamArray[0].intake)
            setShouldReRender(true)
        }else if (isLoadedFromMain === "false"){
            console.log("Not Found")
        }
        console.log("Main " + teamEventData.intake)
        
    }, [isLoadedFromMain])

    useEffect(() => {
        console.log("running add matches")
        if(isLoadedFromMain == "false"){
            console.log("match Nums " + matchNums)
            for(let i = 0; i< matchNums; i++){
                teamEventData.matchData.push({auto_sample_net : "", 
                    auto_sample_low : "",
                    auto_sample_high : "",
                    auto_specimen_low : "",
                    auto_specimen_high : "",
                    auto_park : "",
                    tele_sample_net : "",
                    tele_sample_low : "",
                    tele_sample_high : "",
                    tele_specimen_low : "",
                    tele_specimen_high : "",
                    endgame_park : ""
                })
                console.log("added")
            }
        }
    }, [isMatchNumsFinished])

    useFocusEffect(
        React.useCallback(() => {
          
          console.log('Screen is focused');
          setDataFetched(false)
          let storedTeamArray: number[] = []
          loadedEventData.map((item) => {storedTeamArray.push(item.teamNumber)})
          if(storedTeamArray.indexOf(teamEventData.teamNumber) >= 0){
            setIsLoadedFromMain("true")
          } else {
            
            setIsLoadedFromMain("false")
          }
          /* console.log(loadedEventData) */
    
          return () => {
            setPersistentTeamData(teamEventData)
            //console.log(teamEventData)
          };
        }, [])
      );

    const toggleShowingInfo = () => {
        setShowingInfo(!showingInfo)
    }

    const logTeamEventData = () => {
        console.log("raw : " + teamEventData)
        console.log("JSON : " + JSON.stringify(teamEventData))  
        console.log("team matches number : " + teamEventData.matchData.length)
    }

    useEffect(() => {
        if(dataFetched){
            console.log(matchView)
            let matchArr: string[] = []
            DropdownMatchView.map((item) => {matchArr.push(item.value)})
            let dropDownIndex = matchArr.indexOf(matchView)
            set_auto_park(teamEventData.matchData[dropDownIndex].auto_park)
            set_auto_sample_net(teamEventData.matchData[dropDownIndex].auto_sample_net)
            set_auto_sample_low(teamEventData.matchData[dropDownIndex].auto_sample_low)
            set_auto_sample_high(teamEventData.matchData[dropDownIndex].auto_sample_high)
            set_auto_specimen_low(teamEventData.matchData[dropDownIndex].auto_specimen_low)
            set_auto_specimen_high(teamEventData.matchData[dropDownIndex].auto_sample_high)
            set_tele_sample_net(teamEventData.matchData[dropDownIndex].tele_sample_net)
            set_tele_sample_low(teamEventData.matchData[dropDownIndex].tele_sample_low)
            set_tele_sample_high(teamEventData.matchData[dropDownIndex].tele_sample_high)
            set_tele_specimen_low(teamEventData.matchData[dropDownIndex].tele_specimen_low)
            set_tele_specimen_high(teamEventData.matchData[dropDownIndex].tele_specimen_high)
            set_endgame_park(teamEventData.matchData[dropDownIndex].endgame_park)
            setIntakeVal(teamEventData.intake)
            setDepositVal(teamEventData.deposit)
            setDrivetrainVal(teamEventData.drivetrain)
        }
    }, [matchView])

    useEffect(() => {
        if(dataFetched){
            console.log("changed team event data")
            //console.log(teamEventData.matchData)
            let matchArr: string[] = []
            DropdownMatchView.map((item) => {matchArr.push(item.value)})
            //console.log(DropdownMatchView)
            let dropDownIndex = matchArr.indexOf(matchView)
            //console.log("index" + dropDownIndex)
            //console.log(teamEventData.matchData)
            teamEventData.matchData[dropDownIndex].auto_park = auto_park_value
            //console.log("ran purple check")
            teamEventData.matchData[dropDownIndex].auto_sample_net = auto_sample_net_value
            teamEventData.matchData[dropDownIndex].auto_sample_low = auto_sample_low_value
            teamEventData.matchData[dropDownIndex].auto_sample_high = auto_sample_high_value
            teamEventData.matchData[dropDownIndex].auto_specimen_low = auto_specimen_low_value
            teamEventData.matchData[dropDownIndex].auto_specimen_high = auto_specimen_high_value
            teamEventData.matchData[dropDownIndex].endgame_park = endgame_park_value
            teamEventData.matchData[dropDownIndex].tele_sample_net = tele_sample_net_value
            teamEventData.matchData[dropDownIndex].tele_sample_low = tele_sample_low_value
            teamEventData.matchData[dropDownIndex].tele_sample_high = tele_sample_high_value
            teamEventData.matchData[dropDownIndex].tele_specimen_low = tele_specimen_low_value
            teamEventData.matchData[dropDownIndex].tele_specimen_high = tele_specimen_high_value
            teamEventData.extraNotes = extraNotes
            teamEventData.intake = intakeVal
            console.log(intakeVal)
            teamEventData.deposit = depositVal
            teamEventData.drivetrain = drivetrainVal
        }
    }, [auto_park_value, auto_sample_net_value, auto_sample_low_value, auto_sample_high_value, auto_specimen_low_value, auto_specimen_high_value, endgame_park_value, tele_sample_net_value, tele_sample_low_value, tele_sample_high_value, tele_specimen_low_value, tele_specimen_high_value, extraNotes, intakeVal, depositVal, drivetrainVal])



    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            if(teamNumber){
                try{
                const query = `
                query getTeamByNumber($season: Int!, $number: Int!, $eventCode: String) {
                    teamByNumber(number: $number) {
                        name
                        schoolName
                        location{
                            city
                            state
                        }
                        rookieYear
                        events(season: $season){
                            eventCode
                            stats {
                                ... on TeamEventStats2023{
                                    opr {
                                        totalPointsNp
                                        autoPoints
                                        dcPoints
                                        egPoints
                                    }
                                    rank 
                                }
                            }
                        }
                        matches(season: $season, eventCode: $eventCode){
                            alliance
                            match{
                                tournamentLevel
                                hasBeenPlayed
                                matchNum
                                teams{
                                    alliance
                                    onField
                                    team{
                                        number
                                        name
                                    }
                                }
                                scores {
                                    ... on MatchScores2023{
                                        red{
                                            totalPoints
                                        }
                                        blue{
                                            totalPoints
                                        }
                                    }
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
                    body: JSON.stringify({ query, variables: { season: 2023, number: teamNumber, eventCode : eventCode } })
                });
                const data = await response.json();
                let eventStats : any[] = data.data.teamByNumber.events
                eventStats = eventStats.filter((item) => item.eventCode == eventCode)

                let matchArray: any[] = data.data.teamByNumber.matches
                for(let i = 1; i <= matchArray.length; i++){
                    DropdownMatchView.push({label : "Match " + i, value : "Match " + i})
                    setMatchNums(i)
                }
                setIsMatchNumsFinished(true)

                //console.log("created matches : " + teamEventData.matchData)
                setDataFetched(true)
                let formattedMatchArray: Match[] = []
                matchArray.map((item) => {
                    let newMatch: Match = {matchNum : item.match.matchNum, redTeams : [], blueTeams : [], 
                        redScore : item.match.scores.red.totalPoints, blueScore : item.match.scores.blue.totalPoints, 
                        matchType : item.match.tournamentLevel, hasBeenPlayed : item.match.hasBeenPlayed}
                    let teamArray = item.match.teams
                    teamArray.map((team: any) => {
                        let newTeam: Team = {teamName : team.team.name, teamNumber : team.team.number, alliance : team.alliance, onField : team.onField}
                        if(newTeam.alliance === "Red") {
                            newMatch.redTeams.push(newTeam)
                        } else if(newTeam.alliance === "Blue") {
                            newMatch.blueTeams.push(newTeam)
                        }
                    })
                    formattedMatchArray.push(newMatch)
                })

                
                let formattedTeamData: TeamData = {number : teamNumber, 
                                                    name : data.data.teamByNumber.name, 
                                                    city : data.data.teamByNumber.location.city, 
                                                    state : data.data.teamByNumber.location.state, 
                                                    rookieYear : data.data.teamByNumber.rookieYear,
                                                    school : data.data.teamByNumber.schoolName, 
                                                    tot_opr : Number(eventStats[0].stats.opr.totalPointsNp).toFixed(2), 
                                                    auto_opr : Number(eventStats[0].stats.opr.autoPoints).toFixed(2),
                                                    tele_opr : Number(eventStats[0].stats.opr.dcPoints).toFixed(2),
                                                    eg_opr : Number(eventStats[0].stats.opr.egPoints).toFixed(2), 
                                                    rank : eventStats[0].stats.rank, matches : formattedMatchArray}
                    
                setTeamData(formattedTeamData)
                }
                finally{
                    setLoading(false);
                }
            }
        }
        const unsubscribe = navigation.addListener('focus', () => {
            fetchTeamData();
          });

          return unsubscribe;
    }, [navigation, teamNumber])


    return (
        <GestureHandlerRootView style = {styles.container}>
            <View style = {loading ? styles.loadingStyle : styles.view}>
            {loading ? <ActivityIndicator size="large" color='#fff'/>
            : 
            <>
                <View style = {styles.headerContainer} /* horizontal = {true} showsHorizontalScrollIndicator={false} */>
                    <Text style={styles.headerTeamNameText}>{teamData.name}</Text>
                    <Text style={styles.headerTeamNumberText}>{teamData.number}</Text>
                </View>
                <TouchableOpacity onPress={toggleShowingInfo}>
                    {!showingInfo && <AntDesign name={"infocirlceo"} size={24} color="#328AFF" style = {styles.infoIcon}/>}
                    {showingInfo && <AntDesign name={"infocirlce"} size={24} color="#328AFF" style = {styles.infoIcon}/>}
                </TouchableOpacity>
                {showingInfo && (
                    <View style = {styles.infoScreen}>
                        <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false}>
                            <View style = {styles.column}>
                                <Text style = {styles.infoText}>Rookie Year : {teamData.rookieYear}</Text>
                                <Text style = {styles.infoText}>Location : {teamData.city}, {teamData.state}</Text>
                                <Text style = {styles.infoText}>School : {teamData.school}</Text>
                            </View>
                        </ScrollView>
                    </View>
                )}
                <ScrollView>
                    <EventStatsHeader log={logTeamEventData}/>
                    <EventStatsContainer teamData={teamData}></EventStatsContainer>
                    <EventDataHeader matchVar={matchView} setMatchVar={setMatchView} displayMatchVar={displayMatchView} setDisplayMatchVar={setDisplayMatchView} dropDownMatches={DropdownMatchView}></EventDataHeader>
                    <View style = {styles.eventDataContainer}>
                        
                        <EventDataSubHeader headerName="Autonomous"></EventDataSubHeader>
                            <EventDataStatName headerName = "Sample Scoring"></EventDataStatName>
                                <EventDataCounter headerName="Net Zone" counter_variable={auto_sample_net_value} set_counter_variable={set_auto_sample_net}></EventDataCounter>
                                <EventDataCounter headerName="Low" counter_variable={auto_sample_low_value} set_counter_variable={set_auto_sample_low}></EventDataCounter>
                                <EventDataCounter headerName="High" counter_variable={auto_sample_high_value} set_counter_variable={set_auto_sample_high}></EventDataCounter>
                            <EventDataStatName headerName = "Specimen Scoring"></EventDataStatName>
                                <EventDataCounter headerName="Low" counter_variable={auto_specimen_low_value} set_counter_variable={set_auto_specimen_low}></EventDataCounter>
                                <EventDataCounter headerName="High" counter_variable={auto_specimen_high_value} set_counter_variable={set_auto_specimen_high}></EventDataCounter>
                            <EventDataDropDown headerName="Ascent/Park" option_variable={auto_park_value} set_option_variable={set_auto_park} options={auto_park_options}></EventDataDropDown>
                        <EventDataSubHeader headerName="TeleOp"></EventDataSubHeader>
                            <EventDataStatName headerName = "Sample Scoring"></EventDataStatName>
                                <EventDataCounter headerName="Net Zone" counter_variable={tele_sample_net_value} set_counter_variable={set_tele_sample_net}></EventDataCounter>
                                <EventDataCounter headerName="Low" counter_variable={tele_sample_low_value} set_counter_variable={set_tele_sample_low}></EventDataCounter>
                                <EventDataCounter headerName="High" counter_variable={tele_sample_high_value} set_counter_variable={set_tele_sample_high}></EventDataCounter>
                            <EventDataStatName headerName = "Specimen Scoring"></EventDataStatName>
                                <EventDataCounter headerName="Low" counter_variable={tele_specimen_low_value} set_counter_variable={set_tele_specimen_low}></EventDataCounter>
                                <EventDataCounter headerName="High" counter_variable={tele_specimen_high_value} set_counter_variable={set_tele_specimen_high}></EventDataCounter>
                        <EventDataSubHeader headerName="Endgame"></EventDataSubHeader>
                            <EventDataDropDown headerName="Ascent/Park" option_variable={endgame_park_value} set_option_variable={set_endgame_park} options={endgame_park_options}></EventDataDropDown>
                            {/*<EventDataFieldCheckBox name= "Purple Pixel" checkBoxBoolean = {purplePixelCheck} setCheckBoxBoolean={setPurplePixelCheck}></EventDataFieldCheckBox>
                            <EventDataFieldCheckBox name= "Yellow Pixel" checkBoxBoolean = {yellowPixelCheck} setCheckBoxBoolean={setYellowPixelCheck}></EventDataFieldCheckBox>
                            <EventDataFieldCheckBox name= "Park" checkBoxBoolean = {parkCheck} setCheckBoxBoolean={setParkCheck}></EventDataFieldCheckBox>
                        <EventDataSubHeader headerName="Tele-Op"></EventDataSubHeader>
                            <EventDataFieldCheckBox name= "Drive under Stage Door" checkBoxBoolean = {driveUnderStageDoorCheck} setCheckBoxBoolean={setDriveUnderStageDoorCheck}></EventDataFieldCheckBox>
                            <EventDataFieldTextBox name = "Cycles" valueText={cyclesText} setValueText={setCyclesText}></EventDataFieldTextBox>
                            <EventDataFieldTextBox name = "Backdrop Line Crossed" valueText={backDropLineText} setValueText={setBackDropLineText}></EventDataFieldTextBox>
                            <EventDataFieldTextBox name = "Mosaics Formed" valueText={mosaicText} setValueText={setMosaicText}></EventDataFieldTextBox>
                        <EventDataSubHeader headerName="Endgame"></EventDataSubHeader>
                            <EventDataFieldCheckBox name = "Climb" checkBoxBoolean={climbCheck} setCheckBoxBoolean={setClimbCheck}></EventDataFieldCheckBox>
                            <EventDataFieldTextBox name = "Drone" valueText={droneText} setValueText={setDroneText}></EventDataFieldTextBox>
                            <EventDataFieldExtraNotes name = "Extra Notes" notesText={extraNotes} setNotesText={setExtraNotes}></EventDataFieldExtraNotes> */}
                            
                    </View>
                    <BotAnalysisHeader/>
                    <View style = {[styles.eventDataContainer, {top : 40}]}>
                        <BotAnalysisSlider name = "Intake Mechanism" sliderVal={intakeVal} setSliderVal={setIntakeVal}></BotAnalysisSlider>
                        <BotAnalysisSlider name = "Deposit Mechanism" sliderVal={depositVal} setSliderVal={setDepositVal}></BotAnalysisSlider>
                        <BotAnalysisSlider name = "Drivetrain" sliderVal={drivetrainVal} setSliderVal={setDrivetrainVal}></BotAnalysisSlider>
                        <EventDataDropDown headerName = "Ascent Park" option_variable={ascent_park} set_option_variable={set_ascent_park} options={ascent_park_options}></EventDataDropDown>
                        <EventDataDropDown headerName = "Sample Scoring" option_variable={sample_scoring} set_option_variable={set_sample_scoring} options={sample_scoring_options}></EventDataDropDown>
                        <EventDataDropDown headerName = "Specimen Scoring" option_variable={specimen_scoring} set_option_variable={set_specimen_scoring} options={specimen_scoring_options}></EventDataDropDown>
                    </View>
                    <MatchScheduleHeader></MatchScheduleHeader>
                    <View style = {[styles.eventDataContainer, {top : 80}]}>
                        {teamData.matches.map((item, index) => (
                            <Match match = {item} key = {index} viewingTeamNum={teamNumber}></Match>
                        ))}

                    </View>
                    <View style = {{height : 80, top : 60}}></View>
                    
                </ScrollView>
                </>
            }

            </View>
        </GestureHandlerRootView>
    )

}

type LogFunction = {
    log : () => void
}

const EventStatsHeader: React.FC<LogFunction> = ({log}) => {

    return (
        <View style = {styles.eventHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={36} color="#328AFF" style = {styles.eventIcon}/>
            <Text style = {styles.eventHeaderText}> Event OPR </Text>
                <TouchableOpacity style = {{left : 80}} onPress={log}>
                    <View style = {{backgroundColor : "#328AFF", height : 30, width : 60, display : "flex", justifyContent : "center", alignItems : "center"}}>
                        <Text style = {{color : "white", fontSize : 20}}>Log</Text>
                    </View>
                </TouchableOpacity>
        </View>
    )
}

type EventDataHeaderProps = {
    matchVar : string,
    setMatchVar : (item : string) => void,
    displayMatchVar : string,
    setDisplayMatchVar : (item : string) => void,
    dropDownMatches : dropdownMatches[]
}

const EventDataHeader: React.FC<EventDataHeaderProps> = ({matchVar, setMatchVar, displayMatchVar, setDisplayMatchVar, dropDownMatches}) => {
    return (
        <View style = {styles.eventHeader}>
            <Text style = {styles.eventHeaderText}> Event Data </Text>
            <Dropdown 
                style = {styles.matchDropdown}
                placeholder={displayMatchVar}
                placeholderStyle={styles.dropDownText}
                selectedTextStyle={styles.dropDownText}
                data={dropDownMatches}
                labelField="label"
                valueField="value"
                onChange={item => {
                    setMatchVar(item.value);
                    setDisplayMatchVar(item.value);
                }}
            />
        </View>
    )
}

type EventDataStatNameType = {
    headerName : string
}

const EventDataStatName: React.FC<EventDataStatNameType> = ({headerName}) => {
    return (
        <View style = {{}}>
            <Text style = {{color : "white", fontSize : 18, paddingVertical : 6}}>{headerName}</Text>
        </View>
    )
}

type EventDataCounterType = {
    headerName : string,
    counter_variable : string,
    set_counter_variable : (payload : string) => void
}

const EventDataCounter: React.FC<EventDataCounterType> = ({headerName, counter_variable, set_counter_variable}) => {
    return (
        <View style = {{display : "flex", flexDirection : "row"}}>
            <View style = {{left : 12, width : "80%"}}>
                <Text style = {{fontSize : 14, color : "white"}}> {headerName} </Text>
            </View>
            <TouchableOpacity onPress={() => set_counter_variable((parseInt(counter_variable == "" ? "0" : counter_variable) - 1).toString())}>
                <AntDesign name="minus" size={28} color="white" />
            </TouchableOpacity>
            <View style = {{}}>
                <Text style = {{fontSize : 14, color : "white"}}>
                    {counter_variable == "" ? 0 : counter_variable}
                </Text>
            </View>
            <TouchableOpacity onPress={() => set_counter_variable((parseInt(counter_variable == "" ? "0" : counter_variable) + 1).toString())}>
                <AntDesign name="plus" size={28} color="white" />
            </TouchableOpacity>
        </View>
    )
}

type EventDataDropDownType = {
    headerName : string,
    options : {label : string, value : string}[], 
    option_variable : string,
    set_option_variable : (payload : string) => void
}

const EventDataDropDown: React.FC<EventDataDropDownType> = ({headerName, options, option_variable, set_option_variable}) => {
    return (
        <View style = {{display : "flex", flexDirection : "row",alignItems : "center"}}>
            <View style = {{width : "60%"}}>
            <Text style = {{color : "white",fontSize : 18}}> {headerName} </Text>
            </View>
            <Dropdown 
                style = {styles.matchDropdown}
                placeholder={option_variable}
                placeholderStyle={styles.dropDownText}
                selectedTextStyle={styles.dropDownText}
                data={options}
                labelField="label"
                valueField="value"
                onChange={item => {
                    set_option_variable(item.value);
                    set_option_variable(item.value);
                }}
            />
        </View>
    )
}   

type Stats = {
    teamData : TeamData
}

const EventStatsContainer: React.FC<Stats> = ({teamData}) => {
    return (
        <View style = {styles.eventStatsContainer}>
            <EventStatsColumn name = "Total" value = {teamData.tot_opr}></EventStatsColumn>
            <EventStatsColumn name = "Auto" value = {teamData.auto_opr}></EventStatsColumn>
            <EventStatsColumn name = "Teleop" value = {teamData.tele_opr}></EventStatsColumn>
            <EventStatsColumn name = "Endgame" value = {teamData.eg_opr}></EventStatsColumn>
        </View>
    )
}

type EventStats = {
    name : string, 
    value : string
}

const EventStatsColumn: React.FC<EventStats> = ({name, value}) => {
    return (
        <View style = {styles.eventStatsColumn}>
            <Text style = {styles.eventStatsColumnName}>
                {name}
            </Text>
            <Text style = {styles.eventStatsColumnValue}>
                {value}
            </Text>
        </View>
    )
}

type EventDataSubHeaderName = {
    headerName : string
}

const EventDataSubHeader: React.FC<EventDataSubHeaderName> = ({headerName}) => {
    return (
        <View style = {styles.eventDataSubHeaderContainer}>
            <Text style = {styles.eventDataSubHeader}>{headerName}</Text>
            <View style={styles.eventDataSubheaderDivider}/>
        </View>
    )
}

type EventDataFieldCheckBoxProps = {
    name : string,
    checkBoxBoolean : string,
    setCheckBoxBoolean : (item : string) => void
}

const EventDataFieldCheckBox: React.FC<EventDataFieldCheckBoxProps> = ({name, checkBoxBoolean, setCheckBoxBoolean}) => {
    return (
        <View style = {styles.eventDataFieldContainer}>
            <Text style = {styles.eventDataFieldText}>{name}</Text>
            <View style = {styles.checkBoxContainer}>
                <View style = {styles.checkBoxBorder}>
                    <Checkbox
                        uncheckedColor="#191919"
                        status={checkBoxBoolean === "true" ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCheckBoxBoolean(checkBoxBoolean === "n/a" ? "true" : checkBoxBoolean === "false" ? "true" : "n/a");
                        }}
                        color = {"#328AFF"}
                    />
                </View>
                <View style = {styles.checkBoxBorder}>
                    <Checkbox
                        uncheckedColor="#191919"
                        status={checkBoxBoolean === "false" ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCheckBoxBoolean(checkBoxBoolean === "n/a" ? "false" : checkBoxBoolean === "true" ? "false" : "n/a");
                        }}
                        color = {"#328AFF"}
                    />
                </View>
            </View>
        </View>
    )
}

type EventDataFieldTextBoxProps = {
    name : string, 
    valueText : string,
    setValueText : (text : string) => void
}

const EventDataFieldTextBox : React.FC<EventDataFieldTextBoxProps> = ({name, valueText, setValueText}) => {

    const handleKeyPress = (event: any) => {
        if (event.nativeEvent.key === "Enter") {
          setValueText(valueText)
        }
      };
    
      const handleTextChange = (text: string) => {
        setValueText(text)
      };

    return (
        <View style = {styles.eventDataFieldContainer}>
            <Text style = {styles.eventDataFieldText}>{name}</Text>
            <View style = {styles.eventDataFieldTextBoxContainer}>
                <TextInput
                onKeyPress={handleKeyPress}
                onChangeText={handleTextChange}
                style={styles.eventDataFieldTextBox}
                placeholder=""
                value={valueText}
                onSubmitEditing={handleKeyPress}
                inputMode = "numeric"
                maxLength={2}
                />
            </View>
        </View>
    )
}

type EventDataFieldExtraNotesProps = {
    name : string,
    notesText : string,
    setNotesText : (notes: string) => void
}

const EventDataFieldExtraNotes: React.FC<EventDataFieldExtraNotesProps> = ({name, notesText, setNotesText}) => {

    const handleKeyPress = (event: any) => {
        if (event.nativeEvent.key === "Enter") {
          setNotesText(notesText)
        }
      };
    
      const handleTextChange = (text: string) => {
        setNotesText(text)
        
      };
    
      

    return (
        <View>
            <Text style = {styles.eventDataFieldText}>{name}</Text>
            <View style = {styles.extraNotesContainer}>
                <TextInput
                    onKeyPress={handleKeyPress}
                    onChangeText={handleTextChange}
                    style={styles.extraNotes}
                    placeholder=""
                    value={notesText}
                    onSubmitEditing={handleKeyPress}
                    multiline = {true}
                />
            </View>
        </View>
    )
}

const BotAnalysisHeader = () => {
    return (
        <View style = {[styles.eventHeader, {left : 20, top : 20}]}>
            <FontAwesome6 name="gears" size={36} color="#328AFF" />
            <Text style = {styles.eventHeaderText}> Bot Analysis </Text>
        </View>
    )
}

type BotAnalysisHeaderProps = {
    name : string,
    sliderVal : number,
    setSliderVal : (val : number) => void
}

const BotAnalysisSlider: React.FC<BotAnalysisHeaderProps> = ({name, sliderVal, setSliderVal}) =>{
    return (
        <View style = {styles.BotAnalysisFieldContainer}>
            <Text style = {styles.eventDataFieldText}>{name} : {sliderVal}</Text>
            <View style = {styles.sliderContainer}>
                <Text style = {{color : "white", fontSize : 22}}> 0 </Text>
            <Slider
                style={{width: 240, height: 40}}
                minimumValue={0}
                maximumValue={10}
                minimumTrackTintColor="#328AFF"
                maximumTrackTintColor="white"
                thumbTintColor="#328AFF"
                step={1}
                value={sliderVal}
                onValueChange={setSliderVal}
            />
            <Text style = {{color : "white", fontSize : 22}}> 10 </Text>
            </View>
        </View>
    )
}

const MatchScheduleHeader = () => {
    return (
        <View style = {[styles.eventHeader, {left : 20, top : 60}]}>
            <MaterialIcons name="schedule" size={36} color="#328AFF" />
            <Text style = {styles.eventHeaderText}> Match Schedule </Text>
        </View>
    )
}

type matchViewProps = {
    match : Match,
    viewingTeamNum : string
}

const Match: React.FC<matchViewProps> = ({match, viewingTeamNum}) => {
    
    let matchPrefix = match.matchType === "Quals" ? "Q" : match.matchType === "Semis" ? "SF" : "F"
    let whoWon = match.blueScore > match.redScore ? "Blue" : match.redScore > match.blueScore ? "Red" : "Tie"
    return (
        <View style = {{display : "flex", flexDirection : "column"}}>
            <View style = {{display : "flex", flexDirection : "row", justifyContent : "flex-start", alignItems : "center"}}>
                <Text style = {{fontSize : 22, color : "white"}}>{matchPrefix}-{match.matchNum}</Text>
                <View style = {{display : "flex", flexDirection : "row", left : 80, position : "absolute"}}>
                <Text style = {whoWon == "Red" ? {fontSize : 18, color : "#CF3427", fontStyle : "italic", fontWeight : "bold"} : whoWon == "Tie" ? {fontSize : 18, color : "#7136bf"} : {fontSize : 18, color : "#CF3427"}}>{match.redScore}</Text>
                    <Text style = {{fontSize : 18, color : "white"}}>-</Text>
                    <Text style = {whoWon == "Blue" ? {fontSize : 18, color : "#328AFF", fontStyle : "italic", fontWeight : "bold"} : whoWon == "Tie" ? {fontSize : 18, color : "#7136bf"} : {fontSize : 18, color : "#328AFF"}}>{match.blueScore}</Text>
                </View>
            </View>
            <View style = {{display : "flex", flexDirection : "row"}}>
                <View style = {{backgroundColor : "#CF3427", height : 4, flex : 1}}></View>
                <View style = {{backgroundColor : "#328AFF", height : 4, flex : 1}}></View>
            </View>
            <View style = {{display : "flex", flexDirection : "row", flex : 1}}>
                <View style = {{flex : 1}}>
                    {match.redTeams.map((item, index) => (
                        <View style = {{display: "flex", backgroundColor : item.teamNumber === Number(viewingTeamNum) ? "#AF1D1D" : index % 2 == 0 ? "#5E1E19" : "#713833", height : 30, flex : 1, justifyContent : "flex-start", alignItems : "center", flexDirection : "row"}} key = {index}>
                            <Text style = {{fontSize : 9, color : item.onField ? "white" : "#A0A0A0", left : 10}}>{item.teamNumber} - {item.teamName}</Text>
                        </View>
                    ))}
                </View>
                <View style = {{flex : 1}}>
                    {match.blueTeams.map((item, index) => (
                        <View style = {{display: "flex", backgroundColor : item.teamNumber === Number(viewingTeamNum) ? "#1B57B3" : index % 2 == 0 ? "#1B385F" : "#344F72", height : 30, flex : 1, justifyContent : "flex-start", alignItems : "center", flexDirection : "row"}} key = {index}>
                            <Text style = {{fontSize : 9, color : item.onField ? "white" : "#A0A0A0", left : 10}}>{item.teamNumber} - {item.teamName}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        display : "flex",
        flexDirection : "column",
        justifyContent : "flex-start",
        backgroundColor : "#101010",
        flex : 1
    },
    view : {
        flex : 1,
    },
    loadingStyle:{
        flexDirection:'column',
        flex: 1,
        justifyContent:'center'
    },
    headerTeamNameText : {
        fontSize : 26,
        color : "white",
    },
    headerTeamNumberText : {
        fontSize : 18,
        color : "#328AFF",
    },
    value : {
        position : "absolute",
        right : 20,
        fontSize : 14,
        color : "white",
        alignSelf : "center"
    },
    headerContainer : {
        backgroundColor : "#101010",
        left : 12,
        flexGrow : 0,
        marginTop : 60,
        borderRadius : 12,
        margin : 12,
        width : "80%"
    },
    infoIcon : {
        position : "absolute",
        bottom : 36,
        right : 24
    },
    infoScreen : {
        backgroundColor : "#191919",
        alignSelf : "center",
        height : "20%",
        width : "95%",
        borderRadius : 12
    },
    infoText : {
        color : "white",
        margin : 12,
        fontSize : 20
    },
    column: {
        flexDirection: 'column',
    },
    eventIcon: {
        margin : 20
    },
    eventHeader : {
        backgroundColor : "#101010",
        display : "flex",
        flexDirection : "row",
        alignItems : "center"
    },
    eventHeaderText : {
        color : "white",
        fontSize : 26
    },
    eventStatsContainer : {
        backgroundColor : "#191919",
        width : "90%",
        alignSelf : "center",
        flexDirection : "row",
        borderRadius : 12,
        justifyContent : "space-between",
        padding : 10,
    },
    eventDataContainer : {
        backgroundColor : "#191919",
        width : "90%",
        alignSelf : "center",
        flexDirection : "column",
        borderRadius : 12,
        justifyContent : "space-between",
        padding : 10,
    },
    eventStatsColumn : {
        display : "flex",
        flexDirection : "column",
        alignItems : "center"
    },
    eventStatsColumnName : {
        color : "white",
        fontSize : 20
    },
    eventStatsColumnValue : {
        color : "white",
        fontSize : 16
    },
    eventDataSubHeader : {
        color : "white",
        fontSize : 20,
        fontWeight : "bold"
    },
    eventDataSubHeaderContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent : "space-between",
        alignItems: 'center',
        position: 'relative',
        flex : 1,
        flexGrow: 1,
        paddingHorizontal: 0,
    },
    eventDataLabel : {
        color : "white",
        fontSize : 20,
        marginHorizontal : 20
    },
    eventDataSubheaderDivider : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
    },
    eventDataLabelContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eventDataFieldContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent : "space-between",
        alignItems: 'center',
        position: 'relative',
        flex : 1,
        flexGrow: 1,
        paddingHorizontal: 0,
        paddingTop : 10
    },
    BotAnalysisFieldContainer : {
        display: 'flex',
        flexDirection : "column"
    },
    eventDataFieldText : {
        color : "white",
        fontSize : 18,
        paddingLeft : 10 
    },
    checkBoxContainer : {
        left : -2,
        display: 'flex',
        width : 106,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    matchDropdown: {
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        width: 120,
        padding : 6
    },
    dropDownText: {
        color: "white"
    },
    checkBoxBorder : {
        borderWidth : 3,
        borderColor : "#328AFF",
        borderRadius : 8,
        transform : [{scale : 0.75}]
    },
    eventDataFieldTextBox: {
        borderColor: 'white',
        backgroundColor: "#191919",
        borderBottomWidth: 2,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 20,
        textAlign : "center"
      },
    eventDataFieldTextBoxContainer: {
        backgroundColor : "white",
        position : "absolute",
        right : 34,
        width : "14%"
    }, 
    extraNotesContainer : {
        backgroundColor : "#101010",
        width : "95%",
        alignSelf : "center",
        borderRadius : 8
    },
    extraNotes : {
        borderColor: 'white',
        backgroundColor: "#101010",
        borderWidth: 2,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 20,
        height : 200,
        borderRadius : 8
    }, 
    sliderContainer : {
        display : "flex",
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center"
    }
})

export default TeamScoutingScreen