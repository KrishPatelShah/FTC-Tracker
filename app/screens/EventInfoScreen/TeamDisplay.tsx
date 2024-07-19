import { View, Text, ScrollView } from "react-native";
import { Team } from "./EventInfoScreen";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";

type TeamDisplayProps = {
  teamArray: Team[];
};

enum Sort  {
    Ascending,
    Descending,
    Neutral
}

enum Tab {
    Rank,
    Number,
    OPR
}

type TabState = {
    rank : Sort,
    rankImage : "minussquareo" | "down-square-o" | "up-square-o",
    number : Sort,
    numberImage : "minussquareo" | "down-square-o" | "up-square-o",
    opr : Sort,
    oprImage : "minussquareo" | "down-square-o" | "up-square-o",
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ teamArray }) => {

    const [tabState, setTabState] = useState<TabState>({rank : Sort.Ascending, number : Sort.Neutral, opr : Sort.Neutral, rankImage : "minussquareo", numberImage : "minussquareo", oprImage : "minussquareo"})

    const updateIconImage = (tabType : Tab) => {
        let newTabState: TabState = {rank : Sort.Neutral, number : Sort.Neutral, opr : Sort.Neutral, rankImage : "minussquareo", numberImage : "minussquareo", oprImage : "minussquareo"}
        if(tabType == Tab.Rank){
            if(tabState.rank == Sort.Neutral) {
                newTabState.rank = Sort.Ascending
                newTabState.rankImage = "down-square-o"
            }else if(tabState.rank == Sort.Descending) {
                newTabState.rank = Sort.Ascending
                newTabState.rankImage = "down-square-o"
            }else if(tabState.rank == Sort.Ascending) {
                newTabState.rank = Sort.Descending
                newTabState.rankImage = "up-square-o"
            }
        }else if(tabType == Tab.Number){
            if(tabState.number == Sort.Neutral) {
                newTabState.number = Sort.Ascending
                newTabState.numberImage = "down-square-o"
            }else if(tabState.number == Sort.Descending) {
                newTabState.number = Sort.Ascending
                newTabState.numberImage = "down-square-o"
            }else if(tabState.number == Sort.Ascending) {
                newTabState.number = Sort.Descending
                newTabState.numberImage = "up-square-o"
            } 
        }else if(tabType == Tab.OPR){
            if(tabState.opr == Sort.Neutral) {
                newTabState.opr = Sort.Ascending
                newTabState.oprImage = "down-square-o"
            }else if(tabState.opr == Sort.Descending) {
                newTabState.opr = Sort.Ascending
                newTabState.oprImage = "down-square-o"
            }else if(tabState.opr == Sort.Ascending) {
                newTabState.opr = Sort.Descending
                newTabState.oprImage = "up-square-o"
            } 
        }
        setTabState(newTabState)
    }

    const sortFunction = (a: Team, b: Team): number =>  {
        if(tabState.rank == Sort.Ascending){
            return Number(a.rank) - Number(b.rank)
        } else if(tabState.rank == Sort.Descending){
            return Number(b.rank) - Number(a.rank)
        } else if(tabState.number == Sort.Ascending){
            return Number(a.number) - Number(b.number)
        } else if(tabState.number == Sort.Descending){
            return Number(b.number) - Number(a.number)
        }else if(tabState.opr == Sort.Ascending){
            return Number(b.opr) - Number(a.opr)
        } else if(tabState.opr == Sort.Descending){
            return Number(a.opr) - Number(b.opr)
        }
        return Number(a.rank) - Number(b.rank)
    }


  return (
    <ScrollView style = {{backgroundColor : "#101010"}}>
        <View style = {{display : "flex", flexDirection : "row"}}>
            <View style = {{display : "flex", flexDirection : "row", alignItems : "center", backgroundColor : "#393939" , paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "20%" , marginLeft : 2 }}>
                <TouchableOpacity style = {{display : "flex", flexDirection : "row"}} onPress={() => {updateIconImage(Tab.Rank)}}>
                    <AntDesign name={tabState.rankImage} size={16} color="white" />
                    <Text style = {{color : "white", fontSize : 16, left : 4}}>Rank</Text>
                </TouchableOpacity>
            </View>
            <View style = {{display : "flex", flexDirection : "row", alignItems : "center", backgroundColor : "#393939" , paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "60%" , marginLeft : 2 }}>
                <TouchableOpacity style = {{display : "flex", flexDirection : "row"}} onPress={() => {updateIconImage(Tab.Number)}}>
                <AntDesign name={tabState.numberImage} size={16} color="white" />
                <Text style = {{color : "white", fontSize : 16, left : 4}}>Number - Name</Text>
                </TouchableOpacity>
            </View>
            <View style = {{display : "flex", flexDirection : "row", alignItems : "center", backgroundColor : "#393939" , paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "20%" , marginLeft : 2 }}>
                <TouchableOpacity style = {{display : "flex", flexDirection : "row"}} onPress={() => {updateIconImage(Tab.OPR)}}>
                <AntDesign name={tabState.oprImage} size={16} color="white" />
                <Text style = {{color : "white", fontSize : 16, left : 4}}>OPR</Text>
                </TouchableOpacity>
            </View>
        </View>
        {teamArray.sort(sortFunction).map((item, index) => (
            <View key = {index} style = {{display : "flex", flexDirection : "row", width : "100%", flex : 1}}>
                <View style = {{backgroundColor : index %2 == 0 ? "#328AFF" : "#1B385F", paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "20%", marginLeft : 2 }}>
                    <Text  style = {{color : "white", fontSize : 16}}>{item.rank}</Text>
                </View>
                <View   style = {{backgroundColor : index %2 == 0 ? "#328AFF" : "#1B385F", paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "60%", marginLeft : 2 }}>
                    <Text  style = {{color : "white", fontSize : 16}}>{item.number} - {item.name}</Text>
                </View>
                <View   style = {{backgroundColor : index %2 == 0 ? "#328AFF" : "#1B385F", paddingVertical : 4, paddingLeft : 4, marginVertical : 2, width : "20%", marginLeft : 2 }}>
                    <Text  style = {{color : "white", fontSize : 16}}>{Number(item.opr).toFixed(2)}</Text>
                </View>
            </View>
        ))}
        
    </ScrollView>
  );
};

export default TeamDisplay;