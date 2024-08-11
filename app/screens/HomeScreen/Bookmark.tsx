import { TouchableOpacity, Text } from "react-native";
import { BookmarkType, BookmarkView } from "./homeScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";
import { eventCodeAtom, teamNumberAtom } from "@/dataStore";
import { useEffect, useState } from "react";


const Bookmark: React.FC<BookmarkView> = ({name, code, navigation, setToDelete}) => {

    const setEventCode = useSetAtom(eventCodeAtom)
    const setTeamCode = useSetAtom(teamNumberAtom)
    


    const navigateTo = () => {
        if(isNaN(parseInt(code))) {
            setEventCode(code)
            navigation.navigate("EventInfoScreen")
        } else {
            setTeamCode(code)
            navigation.navigate("TeamInfoScreen")
        }
    }

    return (
        <TouchableOpacity style = {{backgroundColor: '#191919', borderRadius: 10, marginTop: '5%', flexDirection: "row", alignItems: "center",width: '90%'}} onPress={() => {navigateTo()}} onLongPress={() => {setToDelete({name : name, code : code}); console.log("ran long press")}}  delayLongPress={300}>
            <Ionicons name= {isNaN(parseInt(code)) ? "calendar-outline" : "accessibility"} size={30} color="#328AFF" style={{padding: '3.5%'}} />
            <Text numberOfLines={1} style={{color: "white",flex: 1,fontSize: 20, paddingRight: '3.5%'}}>{isNaN(parseInt(code)) ? name : code + " - " + name}</Text>
        </TouchableOpacity>
    )
}


export default Bookmark