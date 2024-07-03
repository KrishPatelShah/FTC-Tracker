import { RootTabParamList } from "@/routes";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";


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
  }

  type TeamMatchData = {
    purplePixelScore : string
  }

  type TeamEventData = {
    match1 : TeamMatchData
  }

  

const MatchView = [{label : "Match 1", value : "Match 1"}, 
    {label : "Match 2", value : "Match 2"}, 
    {label : "Match 3", value : "Match 3"}, 
    {label : "Match 4", value : "Match 4"}, 
    {label : "Match 5", value : "Match 5"}]

const IndivTeamView: React.FC<HomeScreenProps> = ({navigation}) => {

    const storedTeamNumber = useSelector((state: any) => state.teamNumber.teamNumber); 
    const storedEventCode = useSelector((state: any) => state.event.eventCode); 
    const [teamData, setTeamData] = useState<TeamData>({number : "", name : "", city : "", state : "", rookieYear : "", school : "", tot_opr : "", auto_opr : "", tele_opr : "", eg_opr : "", rank : ""})
    const [teamEventData, setTeamEventData] = useState<TeamEventData>({match1 : {purplePixelScore : "N/A"}})
    const [showingInfo, setShowingInfo] = useState(false)
    const [matchView, setMatchView] = useState("Match 1")
    const [displayMatchView, setDisplayMatchView] = useState("Match 1")
    const [purplePixelCheck, setPurplePixelCheck] = useState("n/a")
    const [yellowPixelCheck, setYellowPixelCheck] = useState("n/a")
    const [parkCheck, setParkCheck] = useState("n/a")
    const [driveUnderStageDoorCheck, setDriveUnderStageDoorCheck] = useState("n/a")
    const toggleShowingInfo = () => {
        setShowingInfo(!showingInfo)
    }


    

    useEffect(() => {
        const fetchTeamData = async () => {
            if(storedTeamNumber){
                const query = `
                query getTeamByNumber($season: Int!, $number: Int!) {
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
                    }
                }`;
                const response = await fetch("https://api.ftcscout.org/graphql", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query, variables: { season: 2023, number: storedTeamNumber } })
                });
                const data = await response.json();
                let eventStats : any[] = data.data.teamByNumber.events
                eventStats = eventStats.filter((item) => item.eventCode == storedEventCode)
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
                                                    rank : eventStats[0].stats.rank}
                    
                setTeamData(formattedTeamData)
                //console.log(formattedTeamData)
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
                    <EventStatsHeader></EventStatsHeader>
                    <EventStatsContainer teamData={teamData}></EventStatsContainer>
                    <EventDataHeader matchVar={matchView} setMatchVar={setMatchView} displayMatchVar={displayMatchView} setDisplayMatchVar={setDisplayMatchView}></EventDataHeader>
                    <View style = {styles.eventDataContainer}>
                        <EventDataSubHeader headerName="Autonomous"></EventDataSubHeader>
                        <EventDataFieldCheckBox name= "Purple Pixel" checkBoxBoolean = {purplePixelCheck} setCheckBoxBoolean={setPurplePixelCheck}></EventDataFieldCheckBox>
                        <EventDataFieldCheckBox name= "Yellow Pixel" checkBoxBoolean = {yellowPixelCheck} setCheckBoxBoolean={setYellowPixelCheck}></EventDataFieldCheckBox>
                        <EventDataFieldCheckBox name= "Park" checkBoxBoolean = {parkCheck} setCheckBoxBoolean={setParkCheck}></EventDataFieldCheckBox>
                        <EventDataSubHeader headerName="Tele-Op"></EventDataSubHeader>
                        <EventDataFieldCheckBox name= "Drive under Stage Door" checkBoxBoolean = {driveUnderStageDoorCheck} setCheckBoxBoolean={setDriveUnderStageDoorCheck}></EventDataFieldCheckBox>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )

}

const EventStatsHeader = () => {
    return (
        <View style = {styles.eventHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={36} color="#328AFF" style = {styles.eventIcon}/>
            <Text style = {styles.eventStatsHeaderText}> Event OPR </Text>
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
            <Text style = {styles.eventStatsHeaderText}> Event Data </Text>
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
    eventStatsHeaderText : {
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
        borderBottomWidth: StyleSheet.hairlineWidth,
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
        borderWidth : 2,
        borderColor : "#328AFF",
        borderRadius : 8,
        transform : [{scale : 0.75}]
    }
})

export default IndivTeamView