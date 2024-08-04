
import { View, Text } from "react-native"
import { EventData, Match} from "./TeamInfoScreen"
import { teamNumberAtom } from "@/dataStore"
import { useAtom, useAtomValue } from "jotai"
import { TouchableOpacity } from "react-native-gesture-handler"



type EventDisplayType = {
    data : EventData
}

const DivisionEventDisplay: React.FC<EventDisplayType> = ({data}) => {
    const [teamNumber, setTeamNumber] = useAtom(teamNumberAtom)
    return (
        <View style = {{ display : "flex", flexDirection : "column", marginVertical : 10, width : "100%" }}>
            <Text style = {{fontSize : 24, color : "white"}}>{data.eventName}</Text>
            <View style = {{display : "flex", flexDirection : "row"}}> 
                <Text style = {{fontSize : 18, color : "#328AFF"}}>{data.eventCode} - </Text>
                <Text style = {{fontSize : 18, color : "#328AFF"}}>{data.date}</Text>
            </View>
            <View style = {{display : "flex", flexDirection : "row"}}>
                {data.awards.map((item, index) => (
                <View key = {index} style = {{display : "flex", flexDirection : "row"}}>
                    <Text style = {{color : "white", fontSize : 20, paddingRight : 8}}>{item.type}</Text> 
                    <Text style = {{color : "white", fontSize : 20, paddingRight : 8}}>{item.placement}</Text>
                </View>))}
            </View>
            {data.matches.map((item, index) => (
                    <MatchView match = {item} viewingTeamNum={teamNumber} key = {index} ></MatchView>
                ))}
            <View style = {{borderBottomWidth : 10, borderBottomColor : "#328AFF", top : 10}}></View>
        </View>
    )
}

type matchViewProps = {
    match : Match,
    viewingTeamNum : string
    
}

const MatchView: React.FC<matchViewProps> = ({match, viewingTeamNum}) => {
    
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
                        <View style = {{display: "flex", backgroundColor : item.teamNumber === Number(viewingTeamNum) ? "#AF1D1D" : index % 2 == 0 ? "#5E1E19" : "#713833", height : 30, flex : 1, justifyContent : "flex-start", alignItems : "center", flexDirection : "row"}} key = {index} >
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

export default DivisionEventDisplay