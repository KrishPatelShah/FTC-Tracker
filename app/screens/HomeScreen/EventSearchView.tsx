
import { memo, useEffect, useState } from "react";
import {Text, View, StyleSheet, Pressable, Touchable} from "react-native";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setTeamNumber } from "../../../teamNumberReducers";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/navigation/types";
import { useAtom } from "jotai";
import { eventCodeAtom, scoutingSheetArray } from "@/dataStore";


interface EventSearchViewProps {
    eventName : string;
    date : string;
    code : string;
    navigation : NavigationProp<RootStackParamList>;
    navigateTo : () => void;
    location : string
}

const EventSearchView: React.FC<EventSearchViewProps> = ({eventName, date, code, navigation, navigateTo, location}) => {

    const [eventCode, setEventCode] = useAtom(eventCodeAtom)
    const [globalSheetArray, setScoutingSheetArray] = useAtom(scoutingSheetArray)
    const [isPressed, setIsPressed] = useState(false)
    
    

    const check = () => {
        setEventCode(code)
        if(location === "modal"){
            globalSheetArray.push({code: code, name : eventName, date : date, eventData : []})
            let stringified: string[] = globalSheetArray.map((item) => JSON.stringify(item))
        }
        navigateTo()
    }


    return (
        <TouchableOpacity style={styles.container} onPress = {check}>
            <View style = {styles.view}>
                <View style = {{maxWidth : "60%"}}>
                    <Text style={styles.text}>{eventName}</Text>
                </View>
                <Text style={styles.value}>{date}</Text> 
            </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    container: {
        display : "flex",
        flexDirection : "row",
        justifyContent : "space-between",
        padding : 20,
        backgroundColor : "#328AFF",
        width : "95%",
        margin : 2,
        borderRadius : 8,
        alignSelf : "center",
        alignItems : "center"
    },
    view : {
        flex : 1
    },
    text : {
        fontSize : 14,
        color : "white"
    },
    value : {
        position : "absolute",
        right : 10,
        fontSize : 14,
        color : "white",
        alignSelf : "center"
    }

})

export default EventSearchView