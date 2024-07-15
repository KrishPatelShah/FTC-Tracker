
import { View, Text } from "react-native"
import { EventData } from "./TeamInfoScreen"


type EventDisplayType = {
    data : EventData
}

const EventDisplay: React.FC<EventDisplayType> = ({data}) => {
    return (
        <View style = {{backgroundColor : "#191919", display : "flex", flexDirection : "column", marginVertical : 10 }}>
            <Text style = {{fontSize : 24, color : "white"}}>{data.eventName}</Text>
            <Text style = {{fontSize : 18, color : "#328AFF"}}>{data.eventCode}</Text>
            <View style = {{display : "flex", flexDirection : "row"}}>
                <Text style = {{color : "white", fontSize : 20}}>W-L-T {data.wins}-{data.losses}-{data.losses} </Text>
                <Text style = {{color : "white", fontSize : 20}}>Total OPR {Number(data.eventStats.total).toFixed(2)}</Text>
            </View>
        </View>
    )
}

export default EventDisplay