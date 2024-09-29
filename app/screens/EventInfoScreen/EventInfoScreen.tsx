import { bookmarkCodeArray, eventCodeAtom } from "@/dataStore"
import { AntDesign } from "@expo/vector-icons"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, Text } from "react-native"
import TeamDisplay from "./TeamDisplay"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import AwardDisplay from "./AwardDisplay"
import MatchDisplay from "./MatchDisplay"
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore"
import { FIREBASE_AUTH } from "@/FirebaseConfig"


type EventData = {
    name : string,
    code : string,
    teams : Team[],
    awards : AwardWinner[],
    matches : Match[]
}



export type AwardWinner = {
    awardType : string,
    placement : number,
    name : string,
    number : string,
}

export type Team = {
    name : string,
    number : string,
    rank : string,
    opr : string,
}

export type Match = {
    matchNum : number,
    redTeams : MatchTeam[],
    blueTeams : MatchTeam[],
    blueScore : number, 
    redScore : number,
    matchType : string
    hasBeenPlayed : boolean,
    id : string
}

type MatchTeam = {
    teamNumber : number,
    teamName : string,
    alliance : string,
    onField : boolean
}

enum ViewingData {
    Matches,
    Teams, 
    Awards
}

const EventInfoScreen: React.FC = () => {

    const db = getFirestore();
    const [bookmarkCodes, setBookmarkCodes] = useState<string[]>([]);
    const [eventCode, setEventCode] = useAtom(eventCodeAtom)
    const [eventData, setEventData] = useState<EventData>({name : "", code : "", teams: [], awards : [], matches : []})
    const [viewingData, setViewingData] = useState<ViewingData>(ViewingData.Matches)
    const [eventNameLines, setEventNameLines] = useState(0);
    const [isBookMarked, setIsBookMarked] = useState(false);
    const bookmarks = useAtomValue(bookmarkCodeArray)

    const fetchData = async () => {
        const query = `
            query getEventByCode($season : Int!, $code : String!){
                eventByCode(season : $season, code : $code){
                    name 
                    teams{
                        team{
                            number
                            name
                        }
                        stats{
                            ... on TeamEventStats2023{
                                opr {
                                    totalPointsNp
                                }
                                rank 
                            }
                        }
                    }
                    awards{
                        type
                        placement
                        team{
                            number
                            name
                        }
                    }
                    teamMatches{
                        match{
                            id
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
            }
        `

        const response = await fetch("https://api.ftcscout.org/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ query, variables: {season: 2023, code: eventCode} })
        });
        const data = await response.json();

        const pushMatchData = (match: any, array: Match[]) => {
            let blueTeams: MatchTeam[] = []
            let redTeams: MatchTeam[] = []
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
                array.push({matchNum : match.matchNum, redTeams : redTeams, blueTeams : blueTeams, matchType : match.tournamentLevel, blueScore : match.scores.blue.totalPoints, redScore : match.scores.red.totalPoints, hasBeenPlayed : match.hasBeenPlayed, id : match.id})
            }
        }

        let teamArray: any[] = data.data.eventByCode.teams
        let formattedTeamArray: Team[] = []
        teamArray.map((item) => {
            if(item.stats != null){
                let newTeam: Team = {name : item.team.name, number : item.team.number, rank : item.stats.rank, opr : item.stats.opr.totalPointsNp}
                formattedTeamArray.push(newTeam)
            }
        })
        let awardArray: any[] = data.data.eventByCode.awards
        let formattedAwardArray: AwardWinner[] = []
        awardArray.map((item) => {
            formattedAwardArray.push({awardType : item.type, placement : item.placement, name : item.team.name, number : item.team.number})
        })
        
        let matchArray: any[] = data.data.eventByCode.teamMatches
        let formattedMatchArray: Match[] = []
        matchArray.map((item) => {
            pushMatchData(item.match, formattedMatchArray)
        })
        

        let formattedEventData: EventData = {name: data.data.eventByCode.name, code : eventCode, teams : formattedTeamArray, awards : formattedAwardArray, matches : formattedMatchArray}
        setEventData(formattedEventData)
    }


    useEffect(() => {
        fetchData()
        if (bookmarks.includes(eventCode)){
            setIsBookMarked(true)
        }
    }, [eventCode])

    const bookmarkEvent = (eventCode: string, eventName: string) => {
            try{
              if(FIREBASE_AUTH.currentUser){
                const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);
                try {
                    if(isBookMarked){
                        updateDoc(userRef, {
                            bookmarks: arrayRemove({name: eventName, code : eventCode})
                        })
                        setIsBookMarked(false)
                    }else {
                        updateDoc(userRef, { 
                            bookmarks: arrayUnion({name : eventName, code : eventCode})
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

    const getIconImage = ():"staro" | "star" => {
        if (isBookMarked){
            return "star"
        }
        return "staro"
    } 

    return (
        <GestureHandlerRootView>
        <View style={{ display: "flex", flex: 1, backgroundColor: "#101010", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height : "100%", marginTop:'15%' }}>
            <View style={{ marginTop: 32, top: 12, width: "95%", display: "flex", flexDirection: "column", marginBottom: 12, flexWrap: "wrap"}}>
                <Text style={{ color: "white", fontSize: 36,width: "100%" }} onTextLayout={(e) => setEventNameLines(e.nativeEvent.lines.length)}>{eventData.name}</Text>
                <View style = {{display : "flex", flexDirection : "row", alignItems : "center"}}>
                    <Text style={{ color: "#328AFF", fontSize: 28 }}>{eventData.code}</Text>
                    <TouchableOpacity>
                        <AntDesign name={getIconImage()} size={24} color="#328AFF" style = {{left : 10}} onPress={() => {bookmarkEvent(eventCode, eventData.name)}}/>
                    </TouchableOpacity>
                </View>
                <TabBar viewingData={viewingData} setViewingData={setViewingData}></TabBar>
                <View style = {{backgroundColor : "#191919", height : eventNameLines == 2 ? "73.4%" : "68%"}}>
                {viewingData == ViewingData.Teams && 
                    <TeamDisplay teamArray={eventData.teams}></TeamDisplay>
                }
                {viewingData == ViewingData.Awards && 
                    <AwardDisplay awardArray={eventData.awards}></AwardDisplay>
                }
                {viewingData == ViewingData.Matches && 
                    <MatchDisplay matchArray={eventData.matches}></MatchDisplay>
                }
                </View>
            </View>
        </View>
        </GestureHandlerRootView>
    )
}

type TabBarProps = {
    viewingData : ViewingData
    setViewingData : (item : ViewingData) => void
}

const TabBar: React.FC<TabBarProps> = ({viewingData, setViewingData}) => {
    return (
        <View style = {{display : "flex", flexDirection : "row", justifyContent : "space-between"}}>
            <TouchableOpacity style = {{display : "flex", flexDirection : "column", width : "33%", backgroundColor : viewingData == ViewingData.Matches ? "#191919" : "#000000", borderTopLeftRadius : 8, borderTopRightRadius : 8, padding : 8}} onPress={() => {setViewingData(ViewingData.Matches)}}>
                <View>
                    <Text style = {{color : viewingData == ViewingData.Matches ? "#328AFF" : "white", fontSize : 22}}>Matches</Text>
                    <AntDesign name="clockcircleo" size={24} color= {viewingData == ViewingData.Matches ? "#328AFF" : "white"} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style = {{display : "flex", flexDirection : "column" , width : "33%", backgroundColor : viewingData == ViewingData.Teams ? "#191919" : "#000000", borderTopLeftRadius : 8, borderTopRightRadius : 8, padding : 8}} onPress={() => {setViewingData(ViewingData.Teams)}}>
                <View>
                    <Text style = {{color : viewingData == ViewingData.Teams ? "#328AFF" : "white", fontSize : 22}}>Teams</Text>
                    <AntDesign name="team" size={24} color={viewingData == ViewingData.Teams ? "#328AFF" : "white"} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style = {{display : "flex", flexDirection : "column" , width : "33%", backgroundColor : viewingData == ViewingData.Awards ? "#191919" : "#000000", borderTopLeftRadius : 8, borderTopRightRadius : 8, padding : 8}} onPress={() => {setViewingData(ViewingData.Awards)}}>
                <View>
                    <Text style = {{color : viewingData == ViewingData.Awards ? "#328AFF" : "white", fontSize : 22}}>Awards</Text>
                    <AntDesign name="Trophy" size={24} color={viewingData == ViewingData.Awards ? "#328AFF" : "white"} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default EventInfoScreen