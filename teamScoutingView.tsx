
import {Text, View, StyleSheet} from "react-native";


interface teamScoutingViewProps {
    teamNumber : string;
    teamName : string;
    shownValue : string;
}

const TeamView: React.FC<teamScoutingViewProps> = ({teamNumber, teamName, shownValue}) => {

    const displayValue = shownValue.toString()
    
    return (
        <View style={styles.container}>
          <Text style={styles.text}>{teamName} - {teamNumber}</Text>
          <Text style={styles.value}>{displayValue.slice(0, 6)}</Text> 
        </View>
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

export default TeamView;