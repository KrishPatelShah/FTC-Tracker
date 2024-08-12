import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Modal, Text, FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { NavigationProp } from "@react-navigation/native";
import { eventCodeAtom, scoutingSheetArray } from "@/dataStore";
import EventSearchView from "./EventSearchView";
import { RootStackParamList } from "@/app/navigation/types";

type EventCodeInputProps = {
  navigation: NavigationProp<RootStackParamList>;
  modalVisible: boolean;
  setModalVisible: (item: boolean) => void;
};

type EventSearchData = {
  name: string;
  data: string;
  code: string;
};

const EventCodeInput: React.FC<EventCodeInputProps> = ({ navigation, modalVisible, setModalVisible }) => {
  const [eventCodeJotai, setEventCodeJotai] = useAtom(eventCodeAtom);
  const [searchData, setSearchData] = useState<EventSearchData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchDataVisible, setSearchDataVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(scoutingSheetArray)
  const scoutingSheetArrayIndex = globalScoutingSheetArray.length // don't have to -1 because scouting sheet array has not appended sheet yet

  const eventQuery = `query eventsSearch($season: Int!, $searchText: String!, $limit: Int!, $region: RegionOption!) {
    eventsSearch(season: $season, searchText: $searchText, limit: $limit, region: $region) {
      name
      start
      code
    }
  }`;

  const eventCodeQuery = `query getEventByCode($season: Int!, $code: String!) {
    eventByCode(season: $season, code: $code) {
      name
      start
      code
    }
  }`;

  useEffect(() => {
    if (searchText) {
      fetchData();
    }
  }, [searchText]);

  const fetchData = async () => {
    setSearchData([]);
    let formattedEventData: EventSearchData[] = [];
    let foundByCode = false;
    
    try {
      const response = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: eventCodeQuery, variables: { season: 2023, code: searchText } })
      });
      const data = await response.json();
      if (data.data.eventByCode) {
        const newEvent: EventSearchData = { name: data.data.eventByCode.name, data: data.data.eventByCode.start, code: data.data.eventByCode.code };
        formattedEventData.push(newEvent);
        foundByCode = true;
      }

      if (!foundByCode) {
        const response = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: eventQuery, variables: { season: 2023, searchText: searchText, limit: 10, region: "All" } })
        });
        const data = await response.json();
        const dataArray: any[] = data.data.eventsSearch;
        dataArray.forEach((item) => {
          const newData: EventSearchData = { name: item.name, data: item.start, code: item.code };
          formattedEventData.push(newData);
        });
      }

      setSearchData(formattedEventData);
      setSearchDataVisible(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("TextInput value changed:", textInputValue);
  }, [textInputValue]);

  const renderItem = ({ item }: { item: EventSearchData }) => (
    <EventSearchView eventName={item.name} date={item.data} navigation={navigation} code={item.code} navigateTo={() => {
      navigation.navigate("EventScoutingScreen", {scoutingSheetArrayIndex}) // previous error here, had to define scoutingSheetArrayIndex
      setModalVisible(false);
    }} location="modal"/>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={searchDataVisible ? styles.textInputContainer : styles.textInputContainerInvisData}>
          <TextInput
            style={styles.textInput}
            placeholder={"Enter Event"}
            placeholderTextColor={"grey"}
            value={textInputValue}
            onChangeText={(text) => {
              setTextInputValue(text);
            }}
            cursorColor={"#328aff"}
            onSubmitEditing={() => {
              if(textInputValue == ""){
                console.log("set to invis")
                setSearchDataVisible(false)
              }
              setSearchText(textInputValue);
            }}
          />
          {searchDataVisible && (
            <View style={styles.infoScreen}>
              <FlatList
                data={searchData}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          <TouchableOpacity onPress={() => { setModalVisible(false); }}>
            <Text style={{ color: "#328AFF", fontSize: 20, top : searchDataVisible ? -20 : 20}}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textInputContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#191919",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#328AFF",
    maxWidth: "90%",
    minHeight: "30%",
    maxHeight: "40%",
    minWidth: "90%",
  },

  textInputContainerInvisData: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#191919",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#328AFF",
    height: "10%",
    width: "60%",
  },

  textInput: {
    top: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    textAlign:'center',
    paddingHorizontal: 10,
    color: "white",
    fontSize: 20,
    borderRadius: 4,
  },
  searchResults: {
    flex: 1,
    width: "100%",
  },
  infoScreen: {
    alignSelf: "center",
    width: "90%",
    height: "70%",
    borderRadius: 12,
    marginVertical : 30
  },
});

export default EventCodeInput;