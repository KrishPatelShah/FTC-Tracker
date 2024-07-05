import { RootTabParamList } from "@/routes";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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


type HomeScreenProps = {
    navigation: NavigationProp<RootTabParamList>;
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
    purplePixelCheck : string,
    yellowPixelCheck : string,
    parkCheck : string,
    driveUnderStageDoorCheck : string,
    cycle : string,
    backDropLine : string,
    mosaic : string,
    climbCheck : string,
    drone : string
  }

  type TeamEventData = {
    match1 : TeamMatchData,
    match2 : TeamMatchData,
    match3 : TeamMatchData,
    match4 : TeamMatchData,
    match5 : TeamMatchData,
    extraNotes : string,
    intake : number,
    deposit : number,
    drivetrain : number
  }

  

const MatchView = [{label : "Match 1", value : "Match 1"}, 
    {label : "Match 2", value : "Match 2"}, 
    {label : "Match 3", value : "Match 3"}, 
    {label : "Match 4", value : "Match 4"}, 
    {label : "Match 5", value : "Match 5"}]

const IndivTeamView: React.FC<HomeScreenProps> = ({navigation}) => {

    const storedTeamNumber = useSelector((state: any) => state.teamNumber.teamNumber); 
    const storedEventCode = useSelector((state: any) => state.event.eventCode); 
    const [teamData, setTeamData] = useState<TeamData>({number : "", name : "", city : "", state : "", rookieYear : "", school : "", tot_opr : "", auto_opr : "", tele_opr : "", eg_opr : "", rank : "", matches : []})
    const [teamEventData, setTeamEventData] = useState<TeamEventData>(
        {match1 : {purplePixelCheck : "n/a", yellowPixelCheck : "n/a", parkCheck : "n/a", driveUnderStageDoorCheck : "n/a", cycle : "", backDropLine : "", mosaic : "", climbCheck : "n/a", drone : ""}, 
        match2 : {purplePixelCheck : "n/a", yellowPixelCheck : "n/a", parkCheck : "n/a", driveUnderStageDoorCheck : "n/a", cycle : "", backDropLine : "", mosaic : "" , climbCheck : "n/a", drone : ""},
        match3 : {purplePixelCheck : "n/a", yellowPixelCheck : "n/a", parkCheck : "n/a", driveUnderStageDoorCheck : "n/a", cycle : "", backDropLine : "", mosaic : "", climbCheck : "n/a", drone : ""},
        match4 : {purplePixelCheck : "n/a", yellowPixelCheck : "n/a", parkCheck : "n/a", driveUnderStageDoorCheck : "n/a", cycle : "", backDropLine : "", mosaic : "", climbCheck : "n/a", drone : ""},
        match5 : {purplePixelCheck : "n/a", yellowPixelCheck : "n/a", parkCheck : "n/a", driveUnderStageDoorCheck : "n/a", cycle : "", backDropLine : "", mosaic : "", climbCheck : "n/a", drone : ""},
        extraNotes : "", intake : 5,  deposit : 5, drivetrain : 5
        })
    const [showingInfo, setShowingInfo] = useState(false)
    const [matchView, setMatchView] = useState("Match 1")
    const [displayMatchView, setDisplayMatchView] = useState("Match 1")
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
    
    const [intakeVal, setIntakeVal] = useState(5)
    const [depositVal, setDepositVal] = useState(5)
    const [drivetrainVal, setDrivetrainVal] = useState(5)

    const toggleShowingInfo = () => {
        setShowingInfo(!showingInfo)
    }

    const logTeamEventData = () => {
        console.log(teamEventData)
    }

    useEffect(() => {
        switch (matchView) {
            case "Match 1":
                setPurplePixelCheck(teamEventData.match1.purplePixelCheck)
                setYellowPixelCheck(teamEventData.match1.yellowPixelCheck)
                setParkCheck(teamEventData.match1.parkCheck)
                setDriveUnderStageDoorCheck(teamEventData.match1.driveUnderStageDoorCheck)
                setCyclesText(teamEventData.match1.cycle)
                setBackDropLineText(teamEventData.match1.backDropLine)
                setMosaicText(teamEventData.match1.mosaic)
                setClimbCheck(teamEventData.match1.climbCheck)
                setDroneText(teamEventData.match1.drone)
                break;
            case "Match 2":
                setPurplePixelCheck(teamEventData.match2.purplePixelCheck)
                setYellowPixelCheck(teamEventData.match2.yellowPixelCheck)
                setParkCheck(teamEventData.match2.parkCheck)
                setDriveUnderStageDoorCheck(teamEventData.match2.driveUnderStageDoorCheck)
                setCyclesText(teamEventData.match2.cycle)
                setBackDropLineText(teamEventData.match2.backDropLine)
                setMosaicText(teamEventData.match2.mosaic)
                setClimbCheck(teamEventData.match2.climbCheck)
                setDroneText(teamEventData.match2.drone)
                break;
            case "Match 3":
                setPurplePixelCheck(teamEventData.match3.purplePixelCheck)
                setYellowPixelCheck(teamEventData.match3.yellowPixelCheck)
                setParkCheck(teamEventData.match3.parkCheck)
                setDriveUnderStageDoorCheck(teamEventData.match3.driveUnderStageDoorCheck)
                setCyclesText(teamEventData.match3.cycle)
                setBackDropLineText(teamEventData.match3.backDropLine)
                setMosaicText(teamEventData.match3.mosaic)
                setClimbCheck(teamEventData.match3.climbCheck)
                setDroneText(teamEventData.match3.drone)
                break;

            case "Match 4":
                setPurplePixelCheck(teamEventData.match4.purplePixelCheck)
                setYellowPixelCheck(teamEventData.match4.yellowPixelCheck)
                setParkCheck(teamEventData.match4.parkCheck)
                setDriveUnderStageDoorCheck(teamEventData.match4.driveUnderStageDoorCheck)
                setCyclesText(teamEventData.match4.cycle)
                setBackDropLineText(teamEventData.match4.backDropLine)
                setMosaicText(teamEventData.match4.mosaic)
                setClimbCheck(teamEventData.match4.climbCheck)
                setDroneText(teamEventData.match4.drone)
                break;
            
            case "Match 5":
                setPurplePixelCheck(teamEventData.match5.purplePixelCheck)
                setYellowPixelCheck(teamEventData.match5.yellowPixelCheck)
                setParkCheck(teamEventData.match5.parkCheck)
                setDriveUnderStageDoorCheck(teamEventData.match5.driveUnderStageDoorCheck)
                setCyclesText(teamEventData.match5.cycle)
                setBackDropLineText(teamEventData.match5.backDropLine)
                setMosaicText(teamEventData.match5.mosaic)
                setClimbCheck(teamEventData.match5.climbCheck)
                setDroneText(teamEventData.match5.drone)
                break;
            default : 
                console.log(matchView)
        }
    }, [matchView])

    useEffect(() => {
        switch (matchView) {
            case "Match 1":
                teamEventData.match1.purplePixelCheck = purplePixelCheck
                teamEventData.match1.yellowPixelCheck = yellowPixelCheck
                teamEventData.match1.parkCheck = parkCheck
                teamEventData.match1.driveUnderStageDoorCheck = driveUnderStageDoorCheck
                teamEventData.match1.cycle = cyclesText
                teamEventData.match1.backDropLine = backDropLineText
                teamEventData.match1.mosaic = mosaicText
                teamEventData.match1.climbCheck = climbCheck
                teamEventData.match1.drone = droneText
               
                break;
            case "Match 2":
                teamEventData.match2.purplePixelCheck = purplePixelCheck
                teamEventData.match2.yellowPixelCheck = yellowPixelCheck
                teamEventData.match2.parkCheck = parkCheck
                teamEventData.match2.driveUnderStageDoorCheck = driveUnderStageDoorCheck
                teamEventData.match2.cycle = cyclesText
                teamEventData.match2.backDropLine = backDropLineText
                teamEventData.match2.mosaic = mosaicText
                teamEventData.match2.climbCheck = climbCheck
                teamEventData.match2.drone = droneText
                break;
            case "Match 3":
                teamEventData.match3.purplePixelCheck = purplePixelCheck
                teamEventData.match3.yellowPixelCheck = yellowPixelCheck
                teamEventData.match3.parkCheck = parkCheck
                teamEventData.match3.driveUnderStageDoorCheck = driveUnderStageDoorCheck
                teamEventData.match3.cycle = cyclesText
                teamEventData.match3.backDropLine = backDropLineText
                teamEventData.match3.mosaic = mosaicText
                teamEventData.match3.climbCheck = climbCheck
                teamEventData.match3.drone = droneText
                break;

            case "Match 4":
                teamEventData.match4.purplePixelCheck = purplePixelCheck
                teamEventData.match4.yellowPixelCheck = yellowPixelCheck
                teamEventData.match4.parkCheck = parkCheck
                teamEventData.match4.driveUnderStageDoorCheck = driveUnderStageDoorCheck
                teamEventData.match4.cycle = cyclesText
                teamEventData.match4.backDropLine = backDropLineText
                teamEventData.match4.mosaic = mosaicText
                teamEventData.match4.climbCheck = climbCheck
                teamEventData.match4.drone = droneText
                break;

            case "Match 5":
                teamEventData.match5.purplePixelCheck = purplePixelCheck
                teamEventData.match5.yellowPixelCheck = yellowPixelCheck
                teamEventData.match5.parkCheck = parkCheck
                teamEventData.match5.driveUnderStageDoorCheck = driveUnderStageDoorCheck
                teamEventData.match5.cycle = cyclesText
                teamEventData.match5.backDropLine = backDropLineText
                teamEventData.match5.mosaic = mosaicText
                teamEventData.match5.climbCheck = climbCheck
                teamEventData.match5.drone = droneText
                break;

            default : 
                console.log(matchView)
        }

        teamEventData.extraNotes = extraNotes
        teamEventData.intake = intakeVal
        teamEventData.deposit = depositVal
        teamEventData.drivetrain = drivetrainVal

    }, [purplePixelCheck, yellowPixelCheck, parkCheck, driveUnderStageDoorCheck, cyclesText, backDropLineText, mosaicText, climbCheck, droneText, extraNotes, intakeVal, depositVal, drivetrainVal])


    

    useEffect(() => {
        const fetchTeamData = async () => {
            if(storedTeamNumber){
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
                    body: JSON.stringify({ query, variables: { season: 2023, number: storedTeamNumber, eventCode : storedEventCode } })
                });
                const data = await response.json();
                let eventStats : any[] = data.data.teamByNumber.events
                eventStats = eventStats.filter((item) => item.eventCode == storedEventCode)

                let matchArray: any[] = data.data.teamByNumber.matches
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

                
                let formattedTeamData: TeamData = {number : storedTeamNumber, 
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
        }
        const unsubscribe = navigation.addListener('focus', () => {
            fetchTeamData();
          });

          return unsubscribe;
    }, [navigation, storedTeamNumber])


    return (
        <GestureHandlerRootView style = {styles.container}>
            <View style = {styles.view}>
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
                    <EventDataHeader matchVar={matchView} setMatchVar={setMatchView} displayMatchVar={displayMatchView} setDisplayMatchVar={setDisplayMatchView}></EventDataHeader>
                    <View style = {styles.eventDataContainer}>
                        <EventDataSubHeader headerName="Autonomous"></EventDataSubHeader>
                            <EventDataFieldCheckBox name= "Purple Pixel" checkBoxBoolean = {purplePixelCheck} setCheckBoxBoolean={setPurplePixelCheck}></EventDataFieldCheckBox>
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
                            <EventDataFieldExtraNotes name = "Extra Notes" notesText={extraNotes} setNotesText={setExtraNotes}></EventDataFieldExtraNotes>
                    </View>
                    <BotAnalysisHeader/>
                    <View style = {[styles.eventDataContainer, {top : 40}]}>
                        <BotAnalysisSlider name = "Intake Mechanism" sliderVal={intakeVal} setSliderVal={setIntakeVal}></BotAnalysisSlider>
                        <BotAnalysisSlider name = "Deposit Mechanism" sliderVal={depositVal} setSliderVal={setDepositVal}></BotAnalysisSlider>
                        <BotAnalysisSlider name = "Drivetrain" sliderVal={drivetrainVal} setSliderVal={setDrivetrainVal}></BotAnalysisSlider>
                    </View>
                    <MatchScheduleHeader></MatchScheduleHeader>
                    <View style = {[styles.eventDataContainer, {top : 80}]}>
                        {teamData.matches.map((item, index) => (
                            <Match match = {item} key = {index} viewingTeamNum={storedTeamNumber}></Match>
                        ))}

                    </View>
                    <View style = {{height : 80, top : 60}}></View>
                    
                </ScrollView>
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

}

const EventDataHeader: React.FC<EventDataHeaderProps> = ({matchVar, setMatchVar, displayMatchVar, setDisplayMatchVar}) => {
    return (
        <View style = {styles.eventHeader}>
            <Entypo name="bar-graph" size={36} color="#328AFF"  style = {styles.eventIcon}/>
            <Text style = {styles.eventHeaderText}> Event Data </Text>
            <Dropdown 
                style = {styles.matchDropdown}
                placeholder={displayMatchVar}
                placeholderStyle={styles.dropDownText}
                selectedTextStyle={styles.dropDownText}
                data={MatchView}
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
            <View style = {styles.eventDataLabelContainer}>
                <Text style = {styles.eventDataLabel}>Yes</Text>
                <Text style = {[styles.eventDataLabel, {marginRight : 0}] }>No</Text>
            </View>
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
                        status={checkBoxBoolean === "true" ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCheckBoxBoolean(checkBoxBoolean === "n/a" ? "true" : checkBoxBoolean === "false" ? "true" : "n/a");
                        }}
                        color = {"#328AFF"}
                    />
                </View>
                <View style = {styles.checkBoxBorder}>
                    <Checkbox
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
        flex : 1
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
        paddingHorizontal: 10,
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

export default IndivTeamView