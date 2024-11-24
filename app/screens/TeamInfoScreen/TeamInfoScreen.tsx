import { bookmarkCodeArray, teamNumberAtom } from "@/dataStore"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler"
import EventDisplay from "./EventDisplay"
import DivisionEventDisplay from "./DivisionEventDisplay"
import { AntDesign } from "@expo/vector-icons"
import { FIREBASE_AUTH } from "@/FirebaseConfig"
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore"

type OPR = {
    total : string,
    auto : string,
    tele : string,
    endgame : string   
}

export type EventData = {
    eventCode : string,
    eventName : string,
    rank : string,
    eventStats? : OPR,
    matches : Match[],
    wins? : string,
    losses? : string,
    ties? : string,
    date : string,
    awards : Award[],
    trueEvent : boolean
}

export type Match = {
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

type Award = {
    type : string,
    placement : number
}




const TeamInfoScreen : React.FC = () => {
    const db = getFirestore();
    const teamNumber = useAtomValue(teamNumberAtom)
    const [teamName, setTeamName] = useState("")
    const [overallOPR, setOverallOPR] = useState<OPR>({total : "0", auto : "0", tele : "0", endgame : "0"})
    const [eventDisplay, setEventDisplay] = useState<EventData[]>([])
    const bookmarks = useAtomValue(bookmarkCodeArray)
    const fetchData = async () => {
        const query = `
        query getTeamByNumber($number : Int!, $season : Int!){
            teamByNumber(number: $number){
                name
                quickStats(season: $season){
                    tot{
                        value
                    }
                    auto{
                        value
                    }
                    dc{
                        value
                    }
                    eg{
                        value
                    }
                }
                awards(season: $season){
                    eventCode
                    type
                    placement
                }
                events(season: $season){
                    eventCode
                    event{
                        name
                        start
                    }
                    stats {
                        ... on TeamEventStats2024{
                            opr {
                                totalPointsNp
                                autoPoints
                                dcPoints
                            }
                            rank 
                            wins
                            losses
                            ties
                        }
                    }
                    matches{
                        match{
                            hasBeenPlayed
                            matchNum
                            teams{
                                teamNumber
                                alliance
                                onField
                                team{
                                    name
                                }
                            }
                            tournamentLevel
                            scores {
                                ... on MatchScores2024{
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
            }
        }`
        const response = await fetch("https://api.ftcscout.org/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ query, variables: {number: teamNumber, season: 2024} })
        });
        const data = await response.json();
        console.log(data.data.teamByNumber.name)
        setTeamName(data.data.teamByNumber.name)

        if(data.data.teamByNumber.quickStats != null){
            setOverallOPR({
                total : data.data.teamByNumber.quickStats.tot.value,
                auto : data.data.teamByNumber.quickStats.auto.value,
                tele : data.data.teamByNumber.quickStats.dc.value,
                endgame : data.data.teamByNumber.quickStats.eg.value
            })
        }

        const pushMatchData = (match: any, array: Match[]) => {
            let blueTeams: Team[] = []
            let redTeams: Team[] = []
            //console.log(match.matchNum)
            match.teams.map((item: any) => {
                if(item.alliance == "Red"){
                    redTeams.push({teamName : item.team.name, teamNumber : item.teamNumber, alliance : item.alliance, onField : item.onField})
                }
                if(item.alliance == "Blue"){
                    blueTeams.push({teamName : item.team.name, teamNumber : item.teamNumber, alliance : item.alliance, onField : item.onField})
                }
            })
            //console.log(redTeams)
            //console.log(blueTeams)
            if(match.scores != null){
                array.push({matchNum : match.matchNum, redTeams : redTeams, blueTeams : blueTeams, matchType : match.tournamentLevel, blueScore : match.scores.blue.totalPoints, redScore : match.scores.red.totalPoints, hasBeenPlayed : match.hasBeenPlayed})
            }
        }

        const pushAwardData = (award: any, array : Award[]) => {
            let newAward: Award = {type : award.type, placement : award.placement}
            array.push(newAward)
        }

        const pushEventData = (item :any) => {
            let matchArray: any[] = item.matches
            //console.log(matchArray)
            let formattedMatchArray: Match[] = []
            matchArray.map((item) => (pushMatchData(item.match, formattedMatchArray)))
            let formattedAwardArray: Award[] = []
            let awardArray: any[] = data.data.teamByNumber.awards
            awardArray = awardArray.filter((award) => award.eventCode == item.eventCode)
            awardArray.map((award) => pushAwardData(award, formattedAwardArray))
            //console.log("all events" + item.event.name)
            if(item.stats != null){
                //console.log("true events" + item.event.name)
                formattedEventData.push({eventCode: item.eventCode, 
                    eventName: item.event.name, rank : item.stats.rank, 
                    eventStats : {total : item.stats.opr.totalPointsNp, auto: item.stats.opr.autoPoints, tele : item.stats.opr.dcPoints, endgame : item.stats.opr.egPoints}, 
                    matches : formattedMatchArray, wins : item.stats.wins, losses : item.stats.losses, ties : item.stats.ties, date : item.event.start, awards : formattedAwardArray, trueEvent : true})
            } else {
                console.log(item)
                formattedEventData.push({eventCode : item.eventCode, eventName: item.event.name, rank : "0", matches : formattedMatchArray, date : item.event.start, awards : formattedAwardArray, trueEvent : false})
            }
        }
        //console.log(data.data.teamByNumber.events)
        let eventArray: any[] = data.data.teamByNumber.events
        let formattedEventData: EventData[] = []
        eventArray.map((item) => (
            pushEventData(item)
        ))
        
        //console.log(formattedEventData)
        setEventDisplay(formattedEventData)
        
        
        //console.log(data.data.teamByNumber.name)
    }

    useEffect(() => {
        //console.log(teamNumber)
        fetchData();
        if (bookmarks.includes(teamNumber)){
            setIsBookMarked(true)
        }
    }, [teamNumber])

    const [isBookMarked, setIsBookMarked] = useState(false);

    const getIconImage = ():"staro" | "star" => {
        if (isBookMarked){
            return "star"
        }
        return "staro"
    } 

    const bookmarkTeam = (teamNum: string, teamName: string) => {
        try{
          if(FIREBASE_AUTH.currentUser){
            const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
            try {
                if(isBookMarked){
                    updateDoc(userRef, {
                        bookmarks: arrayRemove({name: teamName, code : teamNum})
                    })
                    setIsBookMarked(false)
                }else {
                    updateDoc(userRef, { 
                        bookmarks: arrayUnion({name : teamName, code : teamNum})
                    });
                    setIsBookMarked(true)
                }
            } 
            catch (error) {
                console.error("Error updating user document:", error);
            }    
          }
        } catch(error : any){
          alert('😓 Error:\n' + error.message)
        } 
}

    return (
        <GestureHandlerRootView>
        <View style = {{display : "flex", flex : 1, backgroundColor : "#101010", flexDirection : "column", justifyContent : "flex-start", alignItems : "center",marginTop:'12%' }}>
            <View style = {{height : "10%", marginTop : 32, top : 12 , width : "95%", display : "flex", flexDirection : "column", marginBottom : 12}}>
                <Text style = {{color : "white", fontSize : 36}}>{teamName}</Text>
                <View style = {{display : "flex", flexDirection : "row", alignItems : "center"}}>
                    <Text style = {{color : "#328AFF", fontSize : 28}}>{teamNumber}</Text>
                    <TouchableOpacity>
                        <AntDesign name={getIconImage()} size={24} color="#328AFF" style = {{left : 10}} onPress={() => {bookmarkTeam(teamNumber, teamName)}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style = {{width : "95%", display : "flex", flexDirection : "column"}} contentContainerStyle = {{alignItems : "center"}} >
                <Header text = {"Stats"}></Header>
                <View style = {{marginHorizontal : 32, top : 2,  width : "95%", display : "flex", flexDirection : "row", justifyContent : "space-evenly", borderRadius : 12, alignItems : "center"}}>
                    <ColumnStats name = {"Total"} value = {overallOPR.total}></ColumnStats>
                    <ColumnStats name = {"Auto"} value = {overallOPR.auto}></ColumnStats>
                    <ColumnStats name = {"Tele"} value = {overallOPR.tele}></ColumnStats>
                    <ColumnStats name = {"Endgame"} value = {overallOPR.endgame}></ColumnStats>
                </View>
                <Header text = {"Events"}></Header>
                <View style = {{display : "flex", width : "100%", alignSelf : "center", flexDirection : "column", borderRadius : 12, justifyContent : "space-between", paddingHorizontal : 10}}>
                {eventDisplay.sort((a, b) => {const dateA = new Date(a.date).getTime();const dateB = new Date(b.date).getTime();return dateA - dateB;}).map((item, index) => (
                    item.trueEvent ? <EventDisplay data={item} key={index} /> : <DivisionEventDisplay data = {item} key={index}/>
                ))}
                </View>
                <View style = {{height : "1%"}}></View>
            </ScrollView>
            
        </View>
        </GestureHandlerRootView>
    )
}

type ColumnType = {
    name : string,
    value : string
}

const ColumnStats: React.FC<ColumnType> = ({name, value}) => {
    return (
        <View style = {{display : "flex", flexDirection : "column", maxWidth : "40%", alignItems : "center"}}>
            <Text style = {{color : "white", fontSize : 20}}>{name}</Text>
            <View style = {{borderBottomWidth : 2, borderBottomColor : "#328AFF", marginVertical : 10, width : "100%"}}></View>
            <Text style = {{color : "white", fontSize : 14}}>{Number(value).toFixed(2)}</Text>
        </View>
    )
}

type HeaderType = {
    text : string,  
}

const Header: React.FC<HeaderType> = ({text}) => {
    return (
        <View style = {{marginHorizontal : 28, top : 2,  width : "95%", display : "flex", flexDirection : "row", justifyContent : "flex-start", alignItems : "center"}}>
            <Text style = {{color : "white", fontSize : 32}}>{text}</Text>
        </View>
    )
}

export default TeamInfoScreen