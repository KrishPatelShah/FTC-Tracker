import React from "react";
import {Text, View, StyleSheet} from "react-native";

interface MatchViewProps {
    matchNumber: number;
    team1: number;
    team2: number;
    team3: number;
    team4: number;
  }
  

   const MatchView: React.FC<MatchViewProps> = ({ matchNumber, team1, team2, team3, team4 }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.matchNumber}>{matchNumber}</Text>
        <Text style={styles.redAlliance}>{team1}</Text>
        <Text style={styles.redAlliance}>{team2}</Text>
        <Text style={styles.blueAlliance}>{team3}</Text>
        <Text style={styles.blueAlliance}>{team4}</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        display : "flex",
        flexDirection : "row",
        justifyContent : "space-between",
        padding : 20
    },

    matchNumber: {
        fontSize : 20,
        color : "#101010",
        minWidth : 30,
        maxWidth : 30,
    },

    redAlliance: {
        fontSize : 20,
        color : "red",
        minWidth : 60,
        maxWidth : 60,
    },   

    blueAlliance: {
        fontSize : 20,
        color : "blue",
        minWidth : 60,
        maxWidth : 60,
    }

})

export default MatchView;