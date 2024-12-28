import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
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

const EventCodeInput: React.FC<EventCodeInputProps> = ({
  navigation,
  modalVisible,
  setModalVisible,
}) => {
  const [eventCodeJotai, setEventCodeJotai] = useAtom(eventCodeAtom);
  const [searchData, setSearchData] = useState<EventSearchData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchDataVisible, setSearchDataVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [globalScoutingSheetArray, setGlobalScoutingSheetArray] = useAtom(
    scoutingSheetArray
  );
  const scoutingSheetArrayIndex = globalScoutingSheetArray.length;

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `query getEventByCode($season: Int!, $code: String!) {
            eventByCode(season: $season, code: $code) {
              name
              start
              code
            }
          }`,
          variables: { season: 2023, code: searchText },
        }),
      });
      const data = await response.json();
      if (data.data.eventByCode) {
        const newEvent: EventSearchData = {
          name: data.data.eventByCode.name,
          data: data.data.eventByCode.start,
          code: data.data.eventByCode.code,
        };
        formattedEventData.push(newEvent);
        foundByCode = true;
      }

      if (!foundByCode) {
        const response = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query eventsSearch($season: Int!, $searchText: String!, $limit: Int!, $region: RegionOption!) {
              eventsSearch(season: $season, searchText: $searchText, limit: $limit, region: $region) {
                name
                start
                code
              }
            }`,
            variables: {
              season: 2023,
              searchText: searchText,
              limit: 10,
              region: "All",
            },
          }),
        });
        const data = await response.json();
        const dataArray: any[] = data.data.eventsSearch;
        dataArray.forEach((item) => {
          const newData: EventSearchData = {
            name: item.name,
            data: item.start,
            code: item.code,
          };
          formattedEventData.push(newData);
        });
      }

      setSearchData(formattedEventData);
      setSearchDataVisible(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderItem = ({ item }: { item: EventSearchData }) => (
    <EventSearchView
      eventName={item.name}
      date={item.data}
      navigation={navigation}
      code={item.code}
      navigateTo={() => {
        navigation.navigate("EventScoutingScreen", {
          scoutingSheetArrayIndex,
        });
        setModalVisible(false);
      }}
      location="modal"
      setInputText={setTextInputValue}
      setDataVisible={setSearchDataVisible}
    />
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
        <View style={styles.textInputContainer}>
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
              if (textInputValue === "") {
                setSearchDataVisible(false);
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
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              setSearchDataVisible(false);
              setTextInputValue("");
              setSearchText("");
              setModalVisible(false);
            }}
          >
            <Text style={styles.exitButtonText}>Exit</Text>
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
    width: "50%",
    padding: 17,
    backgroundColor: "#191919",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#328AFF",
  },
  textInput: {
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 20,
  },
  infoScreen: {
    width: "100%",
    maxHeight: 200,
    marginVertical: 20,
  },
  exitButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#328AFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default EventCodeInput;
