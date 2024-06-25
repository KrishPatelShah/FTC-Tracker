import {Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useEffect } from 'react';
import { Dropdown } from "react-native-element-dropdown";

export default function Index() {
  const [teamNameText, setTeamNameText] = useState('');
  const [rookieYearText, setRookieYear] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedYear, setYear] = useState<string>("2023");
  const [teamTotalOPR, setTotalOPR] = useState('');
  const [teamAutoOPR, setAutoOPR] = useState('');
  const [displayYear, setDisplayYear] = useState("Select year for stats");
  const [statistics, modStatistics] = useState(new Map([
    ["2023", new Map([
      ["total", 0],
      ["auto", 0],
    ])],
    ["2022", new Map([
      ["total", 0],
      ["auto", 0],
    ])],
    ["2021", new Map([
      ["total", 0],
      ["auto", 0],
    ])],
  ]));

  const query = `
  query GetTeamByNumber($number: Int!, $season: Int!) {
  teamByNumber(number: $number) {
    name
    rookieYear
    quickStats(season : $season){ 
        tot{
            value
        }
        auto{
            value
        }
    }
  }
  }`;

  const setStatistics = (arr: any[]) => {
    let moddedYears = []
    for (let i = 0; i < arr.length; i++) {
      const year = (2023 - i).toString();
      moddedYears.push(year)
      if (statistics.has(year)) {
        statistics.get(year)!.set("total", arr[i].data.teamByNumber.quickStats.tot.value);
        statistics.get(year)!.set("auto", arr[i].data.teamByNumber.quickStats.auto.value);
      } else {
        console.error(`Key '${year}' not found in statistics map`);
      }
    }
    if(!moddedYears.includes("2023")){
      statistics.get("2023")!.set("total", 0);
      statistics.get("2023")!.set("auto", 0);
    }
    if(!moddedYears.includes("2022")){
      statistics.get("2022")!.set("total", 0);
      statistics.get("2022")!.set("auto", 0);
    }
    if(!moddedYears.includes("2021")){
      statistics.get("2021")!.set("total", 0);
      statistics.get("2021")!.set("auto", 0);
    }
  }

  const data = [
    {label: "2023", value: "2023"},
    {label: "2022", value: "2022"},
    {label: "2021", value: "2021"},
  ]

  const updateStatsDisplay = () => {
    let tot_opr = statistics.get(selectedYear)?.get("total")?.toString()
    let auto_opr = statistics.get(selectedYear)?.get("auto")?.toString()
    if(tot_opr !== undefined && auto_opr !== undefined && tot_opr !== "0"){
      setTotalOPR(tot_opr)
      setAutoOPR(auto_opr)
    } else {
      setTotalOPR("N/A")
      setAutoOPR("N/A")
    }
  }

  useEffect(() => {
    updateStatsDisplay();
  }, [selectedYear, statistics]);

 
  const fetchTeamName = async () => {
    try {
      let validYears = []
      const response2023 = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({query, variables: {number : parseInt(inputText), season : 2023}}),
        });
        const data2023 = await response2023.json();
        const teamName = data2023.data.teamByNumber.name;
        const rookieYear = data2023.data.teamByNumber.rookieYear;
        setTeamNameText(teamName);
        setRookieYear(rookieYear);
      validYears.push(data2023)
      if(parseInt(rookieYear) > 2022){
        setStatistics(validYears);
      } else if (parseInt(rookieYear) > 2021) {
        validYears.length = 0
        validYears.push(data2023)
        const response2022 = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({query, variables: {number : parseInt(inputText), season : 2022}}),
          });
        const data2022 = await response2022.json();
        validYears.push(data2022)
        setStatistics(validYears)
      } else {
        validYears.length = 0;
        validYears.push(data2023)
        const response2022 = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({query, variables: {number : parseInt(inputText), season : 2022}}),
          });
        const data2022 = await response2022.json();
        const response2021 = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({query, variables: {number : parseInt(inputText), season : 2021}}),
          });
        const data2021 = await response2021.json();
        validYears.push(data2022)
        validYears.push(data2021)
        setStatistics(validYears);
      }
      updateStatsDisplay();
      } catch (error) {
        console.log("Error : " + error)
        setTotalOPR("N/A")
        setAutoOPR("N/A")
      }
  }

  const handleTextChange = (text: string) => {
    setInputText(text);
  };

  const handleKeyPress = (event: any) => {
    if(event.nativeEvent.key === "Enter"){
      fetchTeamName();
    }
  }

  
  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <Text style = {styles.text}>Team Name : {teamNameText}</Text>
        <Text style = {styles.text}>Team Rookie Year : {rookieYearText} </Text>
        <Text style = {styles.text}>Selected Year : {selectedYear}</Text>
        <Text style = {styles.text}>Season Total OPR : {teamTotalOPR}</Text>
        <Text style = {styles.text}>Season Auto OPR : {teamAutoOPR}</Text>
        <TextInput 
          style = {styles.input} 
          placeholder= "Enter text here" 
          onChangeText={handleTextChange} 
          value = {inputText}
          onSubmitEditing={fetchTeamName}
          onKeyPress={handleKeyPress}
          />
        <Dropdown
          style = {styles.dropdown}
          placeholder= {displayYear}
          placeholderStyle = {styles.placeholderText}
          selectedTextStyle = {styles.placeholderText}
          data = {data}
          labelField = "label"
          valueField = "value"
          onChange = {item => {
            setYear(item.value);
            setDisplayYear(item.value);
            updateStatsDisplay();
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      padding : 20,
      backgroundColor: 'black',
      
    },
    text : {
      fontSize: 20,
      color: 'white',
    },
    link : {
      fontSize: 20, 
      top : 60,
      color: 'white',
    },
    input : {
      top : 20,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      color : 'white'
    },
    dropdown: {
      top : 40,
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8
    },
    placeholderText: {
      color: "white"
    },

})


