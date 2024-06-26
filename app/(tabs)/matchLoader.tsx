import { Image, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { global_styles } from '@/styles';
import { useState } from 'react';
import { TextInput, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MatchView from '@/matchView';


interface Team {
    teamNumber: number;
    alliance: string;
}

interface Match {
    id: number;
    data: Team[];
}

export default function HomeScreen() {
    const [teamArray, setTeamArray] = useState([
        { id: '1', name: 'Team 1' },
        { id: '2', name: 'Team 2' },
        { id: '3', name: 'Team 3' },
        { id: '4', name: 'Team 4' },
      ]);

    const [matchArray, setMatchArray] = useState<Match[]>([]);
    const [eventCode, setEventCode] = useState("")
    const [isInputted, setInputted] = useState(false)
    const [isTeamsSelected, setIsTeamsSelected] = useState(false)
    const [isMatchesSelected, setIsMatchesSelected] = useState(false)
    const query = `
    query getEventByCode($season: Int!, $code: String!) {
        eventByCode(season: $season, code: $code) {
            name
            teams{
                team{
                    number
                    name
                }
            }
            teamMatches{
                match{
                    teams{
                        teamNumber
                        alliance
                    }
                }
            }
        }
    }`;

    const fetchData = async () => {
        try{
            const response = await fetch("https://api.ftcscout.org/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({query, variables: {season: 2023, code : eventCode}}),
                });
            const data = await response.json();
            let teamArray = data.data.eventByCode.teams;
            let matchArrayData = data.data.eventByCode.teamMatches;
            //console.log(matchArray)
            const formattedMatchArray: Match[] = matchArrayData.filter((match: any, index: number) => index % 4 === 0).map((match: any, index: number) => ({
                id: index + 1, // Adjust the ID as needed
                data: match.match.teams.map((team: any) => ({
                    teamNumber: team.teamNumber,
                    alliance: team.alliance
                }))
            }));
            //console.log(formattedMatchArray)
            formattedMatchArray.map((match: Match) => {
                //console.log(match.data)
            })
            let formattedTeamArray: { id: any; name: any; }[] = []
            teamArray.map((team: any) => {
                //console.log(team.team.number + " : " + team.team.name)
                formattedTeamArray.push({id : team.team.number, name : team.team.name})
            })
            //console.log(formattedTeamArray)
            setTeamArray(formattedTeamArray)
            //console.log(data.data.eventByCode.teams[0].team.number)
            setMatchArray(formattedMatchArray)
            setInputted(true)
        } catch(error){
            console.log(error)
        }
    }

    

    const handleKeyPress = (event: any) => {
        if(event.nativeEvent.key === "Enter"){
          fetchData();
        }
    }

    const handleTextChange = (text: string) => {
        setEventCode(text);
        setInputted(false);
      };

    const pressTeamsButton = () =>{
        setIsTeamsSelected(true)
        setIsMatchesSelected(false)
    }
    const pressMatchesButton = () =>{
        setIsMatchesSelected(true)
        setIsTeamsSelected(false)
    }


  return (
    <GestureHandlerRootView style = {styles.background}>
        <View style =  {styles.view}>
            <Text style = {styles.title}>
                Match Loader
            </Text>
            <TextInput
                style = {styles.input}
                placeholder= "Enter text here" 
                onChangeText={handleTextChange} 
                value = {eventCode}
                onSubmitEditing={fetchData}
                onKeyPress={handleKeyPress}
            />
            <View style = {styles.buttonContainer}>
                <TouchableOpacity  style = {styles.button} onPress={pressTeamsButton}>
                    <Text style = {styles.buttonText}> Teams </Text>
                </TouchableOpacity>
                <TouchableOpacity  style = {styles.button} onPress={pressMatchesButton}>
                    <Text style = {styles.buttonText}> Matches </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={isMatchesSelected ? styles.matchScroller : styles.teamScroller}>
                {isInputted && isTeamsSelected && teamArray.map((team) => (
                    <Text key={team.id} style={styles.teamText}>
                        {team.name}
                    </Text>
                ))}
                {isInputted && isMatchesSelected && matchArray.map((match) => (
                    <MatchView matchNumber={match.id} team1={match.data[0].teamNumber} team2={match.data[1].teamNumber} team3={match.data[2].teamNumber} team4={match.data[3].teamNumber}>
                        
                    </MatchView>
                ))}
            </ScrollView>
        </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#101010',
      },
      view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'column', 
      },
      input: {
        borderColor: 'gray',
        backgroundColor: "#328AFF",
        borderWidth: 1,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
      },
      title: {
        color: "white",
        fontSize: 26,
        marginBottom: 20,
      },
    teamText : {
        color : "white",
        fontSize : 16,
        padding : 20
    },
    teamScroller : {
        top : 20,
        height : 200,
        width : 300,
        flexGrow : 0,
        backgroundColor : "#328AFF",
        borderRadius :10
    },
    matchScroller : {
        top : 20,
        height : 200,
        width : 340,
        flexGrow : 0,
        backgroundColor : "#FFFFFF",
        borderRadius :10
    },
    buttonText : {
        fontSize : 24,
        color : "white",
        padding : 8
    },
    button : {
        backgroundColor : "#328AFF",
    },
    buttonContainer : {
        flexDirection : "row",
        justifyContent : "space-evenly",
        width : 300
    }
})