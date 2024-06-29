import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootTabParamList } from '@/routes';
import { NavigationProp } from '@react-navigation/native';
import { setEventCode } from '@/eventCodeReducers';


type HomeScreenProps = {
  navigation: NavigationProp<RootTabParamList, 'homeScreen'>;
};

const MainScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const eventCode = useSelector((state: any) => state.event.eventCode); 
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("event code : " + eventCode);
  }, [eventCode]);

  const toggleShowCodeInput = () => {
    setShowCodeInput(!showCodeInput);
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      dispatch(setEventCode(eventCode));
    }
  };

  const handleTextChange = (text: string) => {
    //console.log("text : " + text)
    dispatch(setEventCode(text));
    //console.log("event code : " + eventCode)
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <TouchableOpacity onPress={toggleShowCodeInput}>
          <View style={styles.button}>
            <AntDesign name="pluscircleo" size={24} color="#328AFF" style={styles.icon} />
            <Text style={styles.buttonText}>Create Scouting Sheet</Text>
          </View>
        </TouchableOpacity>
      </View>
      {showCodeInput && (
        <View style={styles.textInputContainer}>
          <TextInput
            onKeyPress={handleKeyPress}
            onChangeText={handleTextChange}
            style={styles.textInput}
            placeholder="Enter Event Code"
            value={eventCode}
            onSubmitEditing={() => navigation.navigate("scoutingSheetTemplate")}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#101010',
  },
  button: {
    backgroundColor: '#191919',
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  buttonText: {
    color: "#328AFF",
    fontSize: 24,
    paddingRight: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  icon: {
    padding: 14,
  },
  textInputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#191919",
    borderWidth: 4,
    borderRadius: 12,
    borderColor: "#328AFF",
    width: "60%",
    height: "10%"
  },
  textInput: {
    borderColor: 'gray',
    backgroundColor: "#328AFF",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 20,
    borderRadius: 4
  }
});