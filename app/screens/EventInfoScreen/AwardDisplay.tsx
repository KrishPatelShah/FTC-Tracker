import { View, Text, ScrollView } from "react-native";
import { AwardWinner } from "./EventInfoScreen"


type AwardDisplayProps = {
    awardArray : AwardWinner[]
}

const sortAwards = (a: string, b: string): number => {
    const awardPoints: { [key: string]: number } = {
        "Inspire": 9,
        "Winner": 8,
        "Think": 7,
        "Finalist": 6,
        "Connect": 5,
        "Innovate": 4,
        "Design": 3,
        "Motivate": 2,
        "Control": 1
    };

    const aNum: number = awardPoints[a] || 0;
    const bNum: number = awardPoints[b] || 0;

    return bNum - aNum;
}

const AwardDisplay: React.FC<AwardDisplayProps> = ({awardArray}) => {
    const getAwardTypes = (): string[] => {
        const awardTypes : string[] = []
        awardArray.map((item) => {
            if(!awardTypes.includes(item.awardType)){
                awardTypes.push(item.awardType)
            }
        })
        return awardTypes
    }

    return (
        <ScrollView>
            {getAwardTypes().sort(sortAwards).map((item, index) => (
                <AwardTable key = {index} text = {item} awardArray={awardArray}></AwardTable>
            ))}
        </ScrollView>
    )
} 

type AwardTableProps = {
    text : string,
    awardArray : AwardWinner[]
}

const AwardTable: React.FC<AwardTableProps> = ({text, awardArray}) => {
    return (
        <View>
            <View style = {{width : "100%", backgroundColor : "#393939", marginVertical : 2}}>
                <Text style = {{fontSize : 22, color : "white"}}> {text} </Text>
            </View>
            {awardArray.filter((item) => (item.awardType == text)).sort((a, b) => a.placement-b.placement).map((item, index) => (
                <AwardWinnerRow key = {index} name = {item.name} number = {item.number} placement={item.placement} index = {index}></AwardWinnerRow>
            ))}
        </View>
    )
}

type AwardWinnerProps = {
    name : string, 
    number : string,
    placement : number,
    index : number
}

const AwardWinnerRow: React.FC<AwardWinnerProps> = ({name, number, placement, index}) => {
    return (
        <View style = {{width : "100%", backgroundColor : index %2 == 0 ? "#328AFF" : "#1B385F" , marginVertical : 2, padding : 4}}>
            <Text style = {{fontSize : 18, color : "white"}}>{placement} - {number} - {name}</Text>
        </View>
    )
}

export default AwardDisplay;