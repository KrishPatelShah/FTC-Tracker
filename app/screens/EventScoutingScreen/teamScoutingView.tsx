
import { memo, useEffect, useState } from "react";
import {Text, View, StyleSheet} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setTeamNumber } from "../../../teamNumberReducers";
import { useAtom } from "jotai";
import { teamNumberAtom } from "@/dataStore";

interface teamScoutingViewProps {
    teamNumber : string;
    teamName : string;
    shownValue : string;
    navigation : any;
}

const TeamView: React.FC<teamScoutingViewProps> = ({teamNumber, teamName, shownValue, navigation}) => {

    const [teamNumberJotai, setTeamNumberJotai] = useAtom(teamNumberAtom)
    
    const [isPressed, setIsPressed] = useState(false)
    const displayValue = shownValue.toString()
    const storedTeamNumber = useSelector((state: any) => state.teamNumber.teamNumber); 
    const dispatch = useDispatch();

    const check = () => {
        setIsPressed(true)
        dispatch(setTeamNumber(teamNumber))
        setTeamNumberJotai(teamNumber)
        navigation.navigate("TeamScoutingScreen")
    }
    
    return (
        
        <TouchableOpacity style={styles.container} onPress = {check}>
            <View style = {styles.view}>
                <Text style={styles.text}>{teamNumber} - {teamName}</Text>
                <Text style={styles.value}>{displayValue.slice(0, 6)}</Text> 
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
        backgroundColor : "#191919",
        width : "95%",
        margin : 2,
        borderRadius : 8
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
        right : 20,
        fontSize : 14,
        color : "white",
        alignSelf : "center"
    }

})

export default memo(TeamView);