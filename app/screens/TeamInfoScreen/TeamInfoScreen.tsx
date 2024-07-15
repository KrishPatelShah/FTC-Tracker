import { teamNumberAtom } from "@/dataStore"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler"
import EventDisplay from "./EventDisplay"

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
    eventStats : OPR,
    matches : Match[],
    wins : string,
    losses : string,
    ties : string
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




const TeamInfoScreen : React.FC = () => {
    const teamNumber = useAtomValue(teamNumberAtom)
    const [teamName, setTeamName] = useState("")
    const [overallOPR, setOverallOPR] = useState<OPR>({total : "0", auto : "0", tele : "0", endgame : "0"})
    const [eventDisplay, setEventDisplay] = useState<EventData[]>([])
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
                matches{
                    eventCode
                }
                events(season: $season){
                    eventCode
                    event{
                        name
                    }
                    stats {
                        ... on TeamEventStats2023{
                            opr {
                                totalPointsNp
                                autoPoints
                                dcPoints
                                egPoints
                            }
                            rank 
                            wins
                            losses
                            ties
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
            body: JSON.stringify({ query, variables: {number: teamNumber, season: 2023} })
        });
        const data = await response.json();
        setTeamName(data.data.teamByNumber.name)
        if(data.data.teamByNumber.quickStats != null){
            setOverallOPR({
                total : data.data.teamByNumber.quickStats.tot.value,
                auto : data.data.teamByNumber.quickStats.auto.value,
                tele : data.data.teamByNumber.quickStats.dc.value,
                endgame : data.data.teamByNumber.quickStats.eg.value
            })
        }

        const pushEventData = (item : any) => {
            if(item.stats != null){
                formattedEventData.push({eventCode: item.eventCode, 
                    eventName: item.event.name, rank : item.stats.rank, 
                    eventStats : {total : item.stats.opr.totalPointsNp, auto: item.stats.opr.autoPoints, tele : item.stats.opr.dcPoints, endgame : item.stats.opr.egPoints}, 
                    matches : [], wins : item.stats.wins, losses : item.stats.losses, ties : item.stats.ties})
            }
            
        }
        //console.log(data.data.teamByNumber.events)
        let eventArray: any[] = data.data.teamByNumber.events
        let formattedEventData: EventData[] = []
        eventArray.map((item) => (
            pushEventData(item)
        ))
        setEventDisplay(formattedEventData)
        console.log(eventDisplay)
        console.log(eventDisplay.length)
        console.log("format" + formattedEventData.length)
        //console.log(data.data.teamByNumber.name)
    }

    useEffect(() => {
        //console.log(teamNumber)
        fetchData();
    }, [teamNumber])

    return (
        <GestureHandlerRootView>
        <View style = {{display : "flex", flex : 1, backgroundColor : "black", flexDirection : "column", justifyContent : "flex-start", alignItems : "center"}}>
            <View style = {{height : "10%", marginTop : 32, top : 12 , width : "95%", display : "flex", flexDirection : "column"}}>
                <Text style = {{color : "white", fontSize : 36}}>{teamName}</Text>
                <Text style = {{color : "#328AFF", fontSize : 28}}>{teamNumber}</Text>
            </View>
            <Header text = {"Stats"}></Header>
            <View style = {{height : "10%", marginHorizontal : 32, top : 2,  width : "95%", display : "flex", flexDirection : "row", backgroundColor : "#101010", justifyContent : "space-evenly", borderRadius : 12, alignItems : "center"}}>
                <ColumnStats name = {"Total"} value = {overallOPR.total}></ColumnStats>
                <ColumnStats name = {"Auto"} value = {overallOPR.auto}></ColumnStats>
                <ColumnStats name = {"Tele"} value = {overallOPR.tele}></ColumnStats>
                <ColumnStats name = {"Endgame"} value = {overallOPR.endgame}></ColumnStats>
            </View>
            <ScrollView style = {{width : "95%", backgroundColor : "#101010"}}>
                {eventDisplay.map((item, index) => (
                    <EventDisplay data={item} key={index}></EventDisplay>
                ))}
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
        <View style = {{height : "10%", marginHorizontal : 28, top : 2,  width : "95%", display : "flex", flexDirection : "row", justifyContent : "flex-start", alignItems : "center"}}>
            <Text style = {{color : "white", fontSize : 32}}>{text}</Text>
        </View>
    )
}




export default TeamInfoScreen