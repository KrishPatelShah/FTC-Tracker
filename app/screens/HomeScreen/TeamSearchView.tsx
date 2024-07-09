
import { memo, useEffect, useState } from "react";
import {Text, View, StyleSheet} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setTeamNumber } from "../../../teamNumberReducers";


interface TeamSearchViewProps {
    teamName : string;
    number : string;
}

const TeamSearchView: React.FC<TeamSearchViewProps> = ({teamName, number}) => {


    
    const [isPressed, setIsPressed] = useState(false)
    
    

    const check = () => {
        console.log(teamName)
    }


    return (
        <TouchableOpacity style={styles.container} onPress = {check}>
            <View style = {styles.view}>
                    <Text style={styles.text}>{teamName} - {number}</Text>
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

export default TeamSearchView