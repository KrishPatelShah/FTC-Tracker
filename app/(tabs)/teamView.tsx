import { RootTabParamList } from "@/routes";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import AntDesign from '@expo/vector-icons/AntDesign';


type HomeScreenProps = {
    navigation: NavigationProp<RootTabParamList>;
  };

  type TeamData = {
    number : string,
    name : string,
    city : string,
    state : string,
    rookieYear : string,
    school : string
  }

const IndivTeamView: React.FC<HomeScreenProps> = ({navigation}) => {

    const storedTeamNumber = useSelector((state: any) => state.teamNumber.teamNumber); 
    const storedEventCode = useSelector((state: any) => state.event.eventCode); 
    const [teamData, setTeamData] = useState<TeamData>({number : "", name : "", city : "", state : "", rookieYear : "", school : ""})
    const [showingInfo, setShowingInfo] = useState(false)

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
                                                    school : data.data.teamByNumber.schoolName }
               
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
                <ScrollView style = {styles.headerContainer} horizontal = {true} showsHorizontalScrollIndicator={false}>
                    <Text style={styles.headerText}>{teamData.number} - {teamData.name}</Text>
                </ScrollView>
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
            </View>
        </GestureHandlerRootView>
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
    headerText : {
        fontSize : 26,
        color : "white",
        
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
        height : "5%",
        flexGrow : 0,
        marginTop : 60,
        borderRadius : 12,
        margin : 12,
        width : "80%"
    },
    infoIcon : {
        position : "absolute",
        bottom : 18,
        right : 18
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

})

export default IndivTeamView