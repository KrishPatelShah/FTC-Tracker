import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
// import { GestureHandlerRootView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '@/app/navigation/types';
import { NavigationProp } from '@react-navigation/native';
import  CustomDropdown  from '@/components/CustomDropdown';
import { setEventCode } from '@/eventCodeReducers';
import CustomSwitch from "@/components/CustomSwitch";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EventCodeInput from './eventCodeInputModal';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import EventSearchView from './EventSearchView';
import TeamSearchView from './TeamSearchView';
import { FIREBASE_AUTH, ASYNC_STORAGE } from '@/FirebaseConfig';
import { RegionOption } from './RegionOptions';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
 
type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};
type TeamSearchData = {
  name : string,
  data : string,
  code : string
}

type EventSearchData = {
  name : string,
  data : string,
  code : string
}

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const eventCode = useSelector((state: any) => state.event.eventCode); 
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState<TeamSearchData[] | EventSearchData[]>([])
  // CustomSwitch state variables
  const [active, setActive] = useState(false);
  const[searchText, setSearchText] = useState('');
  const [textInputValue, setTextInputValue] = useState("");

  const [searchDataVisible, setSearchDataVisible] = useState(false)
  const [regionDropdown, setRegionDropdown] = useState("All")

  const regionDropdownData = Object.keys(RegionOption)
  .filter(key => isNaN(Number(key)))
  .map(key => ({
    label: key,
    value: key
  }));

  const eventQuery = `query eventsSearch($season: Int!, $searchText: String!, $limit : Int!, $region : RegionOption!) {
    eventsSearch(season:$season, searchText: $searchText, limit: $limit, region : $region){
      name
      start
      code
    }
  }`

  const eventCodeQuery = `query getEventByCode($season : Int!, $code : String!){
    eventByCode(season : $season, code : $code){
      name
      start 
      code  
    }
  }`

  const teamQuery = `query teamsSearch($searchText: String!, $limit : Int!, $region : RegionOption!) {
	    teamsSearch(searchText: $searchText, limit: $limit, region : $region){
    		name
    		number
    	}
  }`

  const fetchData = async () => {
    setSearchData([])
    let formattedEventData: EventSearchData[] = []
    let foundByCode: boolean = false;
    if(active){
      const response = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({query : eventCodeQuery, variables: { season: 2023, code: searchText}})
      });
      let data = await response.json()
      console.log(data)
      if(data.data.eventByCode != null){
        let newEvent: EventSearchData = {name : data.data.eventByCode.name, data : data.data.eventByCode.start, code : data.data.eventByCode.code}
        formattedEventData.push(newEvent)
        foundByCode = true;
      }
      setSearchData(formattedEventData)
    }

    if(!foundByCode){
      const response = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({query : active ? eventQuery : teamQuery, variables: { season: 2023, searchText: searchText, limit : 10, region : regionDropdown} })
      });
      let data = await response.json()
      if(active){
        let dataArray: any[] = data.data.eventsSearch
      //console.log(dataArray)
        let limit = 0
        dataArray.map((item) => {
          if(limit < 20){
            let newData: EventSearchData = {name : item.name, data: item.start, code : item.code}
            formattedEventData.push(newData)
            limit++
          }
        })
        setSearchData(formattedEventData)
      } else {
        let dataArray: any[] = data.data.teamsSearch
        //console.log(dataArray)
        let formattedTeamData: TeamSearchData[] = []
        let limit = 0
        dataArray.map((item) => {
          if(limit < 20){
            let newData: TeamSearchData = {name : item.name, data: item.number, code : item.number}
            formattedTeamData.push(newData)
            limit++
          }
        })
        setSearchData(formattedTeamData)
      }
    }
    
    setSearchDataVisible(true)
  }

  useEffect(() => {
    fetchData()
  }, [regionDropdown])

  useEffect(() => {
    if (searchText) {
      fetchData();
    }
  }, [searchText]);

  useEffect(() => {
    setSearchDataVisible(false)
    setSearchText("")
  }, [active]);

  const toggleShowCodeInput = () => {
    setShowCodeInput(!showCodeInput);
  };

  const handleSignOut = async () => {
    FIREBASE_AUTH.signOut()
    await ASYNC_STORAGE.setItem('auth_persistence', JSON.stringify({ email : null, password : null}));
  }

  return (
    <GestureHandlerRootView style = {styles.container}>
      <CustomSwitch  activeColor= '#191919' inactiveColor= '#191919' active={active} setActive={setActive}/>
      <View style={styles.textInputContainer}>
        <Ionicons style={[styles.iconStyling, {left : 20}]} name= {active ? "calendar" : "people"} size={30} color="grey"/>
        <TextInput style={styles.input} 
          placeholder={active ? 'Search for events' : 'Search for teams'} 
          placeholderTextColor={'grey'} 
          value={textInputValue} 
          onChangeText={(text) => {
              setTextInputValue(text);
            }}
          cursorColor={'#328aff'}
          onSubmitEditing={() => {
            if(textInputValue == ""){
              console.log("set to invis")
              setSearchDataVisible(false)
            }
            setSearchText(textInputValue);
          }}
        />
        <TouchableOpacity style = {{right : 10, position : "absolute"}} onPress={()=>{setSearchText(''); setSearchDataVisible(false)}}>
          <Ionicons  style={styles.iconStyling}  name= {'close'} size={30} color="grey"/>   
        </TouchableOpacity>
      </View>

      {searchDataVisible && <View style = {styles.infoScreen}>
        <ScrollView style = {styles.searchResults}>
          {active && searchData.map((item, index) => (
            <EventSearchView eventName={item.name} date={item.data} key = {index} navigation={navigation} code = {item.code} navigateTo={() => {navigation.navigate("EventInfoScreen")}}></EventSearchView>
          ))}
          {!active && searchData.map((item, index) => (
            <TeamSearchView teamName={item.name} number={item.data} key = {index} navigation={navigation}></TeamSearchView>
          ))}
        </ScrollView>
      </View>}

      <CustomDropdown marginTop={10} marginBottom={10} dropdownValue={regionDropdown} setDropDownValue = {setRegionDropdown} dropdownData={regionDropdownData}/>

      <View style={{ marginTop:'5%', flexDirection: 'row', width:'100%', justifyContent:'space-evenly', alignItems:'center', backgroundColor: '#101010'}}>
        <View style={{width: '20%', left: -15, height: 2.5, marginBottom: -5, backgroundColor:'#328AFF', borderRadius: 10}}/>
        <Text style={{fontSize: 35, color:'white' }}>Match Schedule</Text>
        <View style={{width: '20%', right: -15, height: 2.5, marginBottom: -5, backgroundColor:'#328AFF', borderRadius: 10}}/>
      </View>

      <TouchableOpacity style = {styles.button}>
          <Ionicons name="calendar-outline" size={30} color="#328AFF" style={styles.icon} />
          <Text numberOfLines={1} style={styles.buttonText}>California - San Diego SD Championship</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style = {styles.button}>
          <Ionicons name="document-text-outline" size={30} color="#328AFF" style={styles.icon} />
          <Text style={styles.buttonText}>My Scouting Sheets</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.button}>
          <MaterialCommunityIcons name="import" size={30} color="#328AFF" style={styles.icon} />
          <Text style={styles.buttonText}>Import Scouting Sheet</Text>
      </TouchableOpacity>

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
});