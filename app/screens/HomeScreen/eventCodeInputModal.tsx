import { RootStackParamList } from "@/app/navigation/types";
import { setEventCode } from "@/eventCodeReducers";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { TextInput, View, StyleSheet, Modal, Text } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import OutsideClickHandler from 'react-outside-click-handler';
import { TouchableOpacity } from "react-native-gesture-handler";

type EventCodeInputProps = {
    navigation: NavigationProp<RootStackParamList>;
    modalVisible: boolean,
    setModalVisible: (item: boolean) => void
}




const EventCodeInput: React.FC<EventCodeInputProps> = ({ navigation, modalVisible, setModalVisible }) => {

    const eventCode = useSelector((state: any) => state.event.eventCode); 
  const dispatch = useDispatch();

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
        <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
        <View style = {styles.centeredView}>
        <View style={styles.textInputContainer}>
          <TextInput
            onKeyPress={handleKeyPress}
            onChangeText={handleTextChange}
            style={styles.textInput}
            placeholder="Enter Event Code"
            value={eventCode}
            onSubmitEditing={() => {navigation.navigate("EventScoutingScreen")
                setModalVisible(false)
              }}
          />
          <TouchableOpacity onPress={() => {setModalVisible(false)}}>
            <Text style = {{top : 10, color : "#328AFF", fontSize : 20}}>Exit</Text>

          </TouchableOpacity>
        </View>
        </View>
    </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
      },

})

export default EventCodeInput