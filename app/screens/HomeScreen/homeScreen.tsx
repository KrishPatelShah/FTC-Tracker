import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
// import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '@/app/navigation/types';
import { NavigationProp } from '@react-navigation/native';
import  CustomDropdown  from '@/components/CustomDropdown';
import { setEventCode } from '@/eventCodeReducers';
import CustomSwitch from "@/components/CustomSwitch";
import { Ionicons } from '@expo/vector-icons';
import EventCodeInput from './eventCodeInputModal';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import EventSearchView from './EventSearchView';
import TeamSearchView from './TeamSearchView';
import { FIREBASE_AUTH, ASYNC_STORAGE } from '@/FirebaseConfig';

type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};
type TeamSearchData = {
  name : string,
  data : string
}

type EventSearchData = {
  name : string,
  data : string
}

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const eventCode = useSelector((state: any) => state.event.eventCode); 
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState<TeamSearchData[] | EventSearchData[]>([])
  // CustomSwitch state variables
  const [active, setActive] = useState(false);
  const[inputText, setInputText] = useState('');
  const [searchDataVisible, setSearchDataVisible] = useState(false)

  const eventQuery = `query eventsSearch($season: Int!, $searchText: String) {
    eventsSearch(season:$season, searchText: $searchText){
      name
      start
    }
  }`

  const teamQuery = `query teamsSearch($searchText: String) {
	    teamsSearch(searchText: $searchText){
    		name
    		number
    	}
}`

  const fetchData = async () => {
    setSearchData([])
    const response = await fetch("https://api.ftcscout.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({query : active ? eventQuery : teamQuery, variables: { season: 2023, searchText: inputText } })
    });
    let data = await response.json()
    //console.log(data)
    if(active){
      let dataArray: any[] = data.data.eventsSearch
      //console.log(dataArray)
      let formattedEventData: EventSearchData[] = []
      dataArray.map((item) => {
        let newData: EventSearchData = {name : item.name, data: item.start}
        formattedEventData.push(newData)
      })
      setSearchData(formattedEventData)
    } else {
      let dataArray: any[] = data.data.teamsSearch
      console.log(dataArray)
      let formattedTeamData: TeamSearchData[] = []
      dataArray.map((item) => {
        let newData: TeamSearchData = {name : item.name, data: item.number}
        formattedTeamData.push(newData)
      })
      setSearchData(formattedTeamData)
    }
    setSearchDataVisible(true)
  }

  useEffect(() => {
    console.log(searchData)
  }, [searchData])

  useEffect(() => {
    console.log("event code : " + eventCode);
  }, [eventCode]);

  useEffect(() => {
    setSearchDataVisible(false)
    setInputText("")
  }, [active]);

  const toggleShowCodeInput = () => {
    setShowCodeInput(!showCodeInput);
    console.log(showCodeInput)
  };

  const handleSignOut = async () => {
    FIREBASE_AUTH.signOut()
    await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email : null, password : null}));
  }

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
    <GestureHandlerRootView style = {styles.container}>
      <CustomSwitch  activeColor= '#191919' inactiveColor= '#191919' active={active} setActive={setActive}/>
      <View style={styles.textInputContainer}>
        <Ionicons style={[styles.iconStyling, {left : 20}]} name= {active ? "calendar" : "people"} size={30} color="grey"/>
        <TextInput style={styles.input} 
          placeholder={active ? 'Search for events' : 'Search for teams'} 
          placeholderTextColor={'grey'} 
          value={inputText} 
          onChangeText={(text) => {setInputText(text)}}
          cursorColor={'#328aff'}
          onSubmitEditing={fetchData}
        />
        <TouchableOpacity style = {{right : 10, position : "absolute"}} onPress={()=>{setInputText(''); setSearchDataVisible(false)}}>
          <Ionicons  style={styles.iconStyling}  name= {'close'} size={30} color="grey"/>   
        </TouchableOpacity>
      </View>

      {searchDataVisible && <View style = {styles.infoScreen}>
        <ScrollView style = {styles.searchResults}>
          {active && searchData.map((item, index) => (
            <EventSearchView eventName={item.name} date={item.data} key = {index}></EventSearchView>
          ))}
          {!active && searchData.map((item, index) => (
            <TeamSearchView teamName={item.name} number={item.data} key = {index} navigation={navigation}></TeamSearchView>
          ))}
        </ScrollView>
      </View>}

      <CustomDropdown marginTop={10} marginBottom={10}/>

      <View style={{ marginTop:'5%', flexDirection: 'row', width:'100%', justifyContent:'space-evenly', alignItems:'center', backgroundColor: '#101010'}}>
        <View style={{width: '30%', left: -15, height: 2.5, marginBottom: -5, backgroundColor:'#328AFF', borderRadius: 10}}/>
        <Text style={{fontSize: 35, color:'white' }}>Scouting</Text>
        <View style={{width: '30%', right: -15, height: 2.5, marginBottom: -5, backgroundColor:'#328AFF', borderRadius: 10}}/>
      </View>
      
      <TouchableOpacity onPress={toggleShowCodeInput} style = {styles.button}>
          <AntDesign name="pluscircleo" size={30} color="#328AFF" style={styles.icon} />
          <Text style={styles.buttonText}>Create Scouting Sheet</Text>
      </TouchableOpacity>
        
      <EventCodeInput navigation = {navigation} modalVisible = {showCodeInput} setModalVisible={setShowCodeInput}></EventCodeInput>

      <Text style={[styles.text, {marginTop: 20}]} onPress={handleSignOut}>
        Sign out
      </Text>
    
    </GestureHandlerRootView> 
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flexDirection: 'column',
    alignItems : "center",
    backgroundColor: '#101010',
    paddingTop: 110,
    flex : 1
  },
  textInputContainer:{
    backgroundColor: '#191919',
    display : "flex",
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "flex-start",
    width : "90%",
    height: windowHeight/17,
    borderRadius: 10,
    marginTop: '-5.5%',
  },
  iconStyling:{
    position:'relative',
  },
  input:{
    fontSize: 22,
    color: 'white',
    height : "100%",
    left : 38,
    flex : 1
  },
  text:{
    fontSize: 20,
    color: 'white'
  },
  dropDownText:{
    fontSize: 20,
    color: 'white'
  },
  button: {
    backgroundColor: '#191919',
    borderRadius: 10,
    marginTop:'5%',
    flexDirection: "row",
    alignItems: "center",
    width: '90%',
    height: '8%',
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    padding: 14,
  },
  infoScreen : {
    backgroundColor : "#191919",
    alignSelf : "center",
    height : "20%",
    width : "90%",
    borderRadius : 12
},
searchResults : {
  display: "flex",
  flexDirection : "column",
}

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