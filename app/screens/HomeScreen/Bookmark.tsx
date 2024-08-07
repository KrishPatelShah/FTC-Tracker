import { TouchableOpacity, Text } from "react-native";
import { BookmarkType, BookmarkView } from "./homeScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { eventCodeAtom } from "@/dataStore";
import { useEffect, useState } from "react";


const Bookmark: React.FC<BookmarkView> = ({name, code, navigation}) => {

    const [eventCode, setEventCode] = useAtom(eventCodeAtom)
    
    


    useEffect(() => {

    }, [])

    const navigateTo = () => {
        if(isNaN(parseInt(code))) {
            setEventCode(code)
            navigation.navigate("EventInfoScreen")
        }
    }

    return (
        <TouchableOpacity style = {{backgroundColor: '#191919', borderRadius: 10, marginTop: '5%', flexDirection: "row", alignItems: "center",width: '90%'}} onPress={() => {navigateTo()}}>
            <Ionicons name="calendar-outline" size={30} color="#328AFF" style={{padding: '3.5%'}} />
            <Text numberOfLines={1} style={{color: "white",flex: 1,fontSize: 20, paddingRight: '3.5%'}}>{name}</Text>
        </TouchableOpacity>
    )
}


export default Bookmark