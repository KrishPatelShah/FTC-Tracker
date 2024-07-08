import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
// import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '@/app/navigation/types';
import { NavigationProp } from '@react-navigation/native';
import { setEventCode } from '@/eventCodeReducers';
import CustomSwitch from "@/components/CustomSwitch";
import { Ionicons } from '@expo/vector-icons';


type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const eventCode = useSelector((state: any) => state.event.eventCode); 
  const dispatch = useDispatch();

  // CustomSwitch state variables
  const [active, setActive] = useState(false);
  const[inputText, setInputText] = useState('');

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
    <View style={styles.container}>
      <CustomSwitch  activeColor= '#191919' inactiveColor= '#191919' active={active} setActive={setActive}/>

      <View style={styles.textInputContainer}>
        <TextInput style={styles.input} 
          placeholder={active ? 'Search for events' : 'Search for teams'} 
          placeholderTextColor={'grey'} 
          value={inputText} 
          onChangeText={(text) => {setInputText(text)}}
          cursorColor={'#328aff'}
        />

        <Ionicons style={styles.iconStyling} name= {active ? "calendar" : "people"} size={30} color="grey"/>   
        <TouchableOpacity style={{alignSelf: 'flex-end', bottom: 30, left: -20}} onPress={()=>setInputText('')}>
          <Ionicons style={styles.iconStyling} name= {'close'} size={30} color="grey"/>   
        </TouchableOpacity>
      </View>
    </View>    
  );
};

export default HomeScreen;

/*
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
            onSubmitEditing={() => navigation.navigate("EventScoutingScreen")}
          />
        </View>
      )}
</GestureHandlerRootView>
*/

const styles = StyleSheet.create({
  // Homepage Styling
  container:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 80,
  },
  textInputContainer:{
    backgroundColor: '#191919',
    width: 425,
    height: 45,
    borderRadius: 10,
    marginTop: -20
  },
  iconStyling:{
    alignSelf:'flex-start',
    position:'relative',
    left: 10,
    bottom:30, 
  },
  input:{
    fontSize: 22,
    color: 'white',
    width: 330,
    alignSelf: 'flex-end',
    right: 43,
    marginTop:5
  },
  text:{
    fontSize: 20,
    color: 'white'
  }


/*
  container: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: 'center',
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
  },

  // CustomSwitch Styling
  input:{
    fontSize: 22,
    color: 'white',
    width: 300,
    alignSelf: 'flex-end',
    right: 45,
    marginTop:10
  },
  iconStyling:{
    alignSelf:'flex-start',
    position:'relative',
    left: 10,
    bottom:30, 
  },
  */
});