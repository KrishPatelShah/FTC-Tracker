
import { memo, useEffect, useState } from "react";
import {Text, View, StyleSheet} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setTeamNumber } from "../../../teamNumberReducers";


interface EventSearchViewProps {
    eventName : string;
    date : string;
}

const EventSearchView: React.FC<EventSearchViewProps> = ({eventName, date}) => {


    
    const [isPressed, setIsPressed] = useState(false)
    
    

    const check = () => {
        console.log(eventName)
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