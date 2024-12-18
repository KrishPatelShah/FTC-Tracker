import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '@/app/navigation/types';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import CustomDropdown from '@/components/CustomDropdown';
import { setEventCode } from '@/eventCodeReducers';
import CustomSwitch from "@/components/CustomSwitch";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EventCodeInput from './eventCodeInputModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EventSearchView from './EventSearchView';
import TeamSearchView from './TeamSearchView';
import { FIREBASE_AUTH, ASYNC_STORAGE } from '@/FirebaseConfig';
import { RegionOption } from './RegionOptions';
import { getFirestore, doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import Bookmark from './Bookmark';
import { useSetAtom } from 'jotai';
import { bookmarkCodeArray } from '@/dataStore';
import DeleteBookmark from './DeleteBookmarkModal';

type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};
type TeamSearchData = {
  name: string,
  data: string,
  code: string
}

type EventSearchData = {
  name: string,
  data: string,
  code: string
}

const windowHeight = Dimensions.get('window').height;

export type BookmarkType = {
  name: string,
  code: string,
}

export type BookmarkView = {
  name: string,
  code: string,
  navigation : NavigationProp<RootStackParamList>;
  setToDelete : (payload: BookmarkType) => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const eventCode = useSelector((state: any) => state.event.eventCode);
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState<TeamSearchData[] | EventSearchData[]>([])
  const [active, setActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [textInputValue, setTextInputValue] = useState("");
  const [searchDataVisible, setSearchDataVisible] = useState(false);
  const [regionDropdown, setRegionDropdown] = useState("All");
  
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const setBookmarkCodes = useSetAtom(bookmarkCodeArray)
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<BookmarkType>({name : "", code : ""})


  useEffect(() => {
    if (bookmarkToDelete.name !== "" && bookmarkToDelete.code !== "") {
      setBookmarkModalVisible(true);
      console.log("ran useEffect");
    }
  }, [bookmarkToDelete]);

  const db = getFirestore();

  const fetchFirebaseData = async ()=>{
    if(FIREBASE_AUTH.currentUser){
      const userRef = doc(db, 'user_data', FIREBASE_AUTH.currentUser.uid);

      try {
        const docSnap = await getDoc(userRef);
          if (docSnap) {
            const userData = docSnap.data() as DocumentData 
            console.log("set");
            setBookmarks(userData.bookmarks)
          } 
      } 
      catch (error) {
        console.error("😓 Error retrieving document:", error);
      }

    }
  }


  const collectCodes = () => {
    setBookmarkCodes(bookmarks.map((item) => (item.code)))
  }


  useEffect( () => {
    fetchFirebaseData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchFirebaseData();
    }, [])
  );


  useEffect(() => {
    console.log("bookmarks")
    console.log(bookmarks)
    collectCodes()
  }, [bookmarks])

  
  


  const regionDropdownData = Object.keys(RegionOption)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      label: key,
      value: key
    }));

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

  const teamQuery = `query teamsSearch($searchText: String!, $limit: Int!, $region: RegionOption!) {
    teamsSearch(searchText: $searchText, limit: $limit, region: $region) {
      name
      number
    }
  }`;

  const fetchData = async () => {
    console.log("fetching for " + searchText + " and " + regionDropdown)
    setSearchData([]);
    let formattedEventData: EventSearchData[] = [];
    let foundByCode: boolean = false;
    if (active) {
      const response = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: eventCodeQuery, variables: { season: 2024, code: searchText } })
      });
      let data = await response.json();
      //console.log("Code")
      //console.log(data);
      if (data.data.eventByCode != null) {
        let newEvent: EventSearchData = { name: data.data.eventByCode.name, data: data.data.eventByCode.start, code: data.data.eventByCode.code };
        formattedEventData.push(newEvent);
        foundByCode = true;
      }
      setSearchData([...formattedEventData]);
    }

    if (!foundByCode) {
      const response = await fetch("https://api.ftcscout.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: active ? eventQuery : teamQuery, variables: { season: 2024, searchText: searchText, limit: 10, region: regionDropdown } })
      });
      let data = await response.json();
      if (active) {
        let dataArray: any[] = data.data.eventsSearch;
        let limit = 0;
        //console.log("Name")
        //console.log(data);
        dataArray.map((item) => {
          if (limit < 20) {
            let newData: EventSearchData = { name: item.name, data: item.start, code: item.code };
            formattedEventData.push(newData);
            limit++;
          }
        });
        console.log("search data")
        console.log(searchData)
        setSearchData([...formattedEventData]);
        console.log("set")
        console.log(formattedEventData);
      } else {
        let dataArray: any[] = data.data.teamsSearch;
        let formattedTeamData: TeamSearchData[] = [];
        let limit = 0;
        dataArray.map((item) => {
          if (limit < 20) {
            let newData: TeamSearchData = { name: item.name, data: item.number, code: item.number };
            formattedTeamData.push(newData);
            limit++;
          }
        });
        setSearchData([...formattedTeamData]);
      }
    }
   
    /* if (formattedEventData.length > 0 || (!active && searchData.length > 0)) {
      setSearchDataVisible(true);
      console.log("should render")
      //console.log(searchData)
    } else {
      setSearchDataVisible(false);
    } */
  }

  useEffect(() => {
    console.log(active)
    console.log(searchData.length)
    if (searchData.length > 0) {
      setSearchDataVisible(true);
      console.log("should render")
      //console.log(searchData)
    } else {
      setSearchDataVisible(false);
    }
  }, [searchData])

  useEffect(() => {
    setSearchText("");
    setTextInputValue("");
    setSearchData([])
    setSearchDataVisible(false);
    //fetchData();
  }, [regionDropdown]);

  useEffect(() => {
    if (searchText) {
      fetchData();
    }
  }, [searchText]);

  useEffect(() => {
    setSearchDataVisible(false);
    setSearchText("");
    setTextInputValue("");
  }, [active]);

  const toggleShowCodeInput = () => {
    setShowCodeInput(!showCodeInput);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} bounces={false}>
        <CustomSwitch activeColor='#191919' inactiveColor='#191919' active={active} setActive={setActive} />
        <View style={styles.textInputContainer}>
          <Ionicons style={[styles.iconStyling, { left: 20 }]} name={active ? "calendar" : "people"} size={25} color="grey" />
          <TextInput style={styles.input}
            placeholder={active ? 'Search for events' : 'Search for teams'}
            placeholderTextColor={'grey'}
            value={textInputValue}
            onChangeText={(text) => {
              setTextInputValue(text);
            }}
            cursorColor={'#328aff'}
            onSubmitEditing={() => {
              if (textInputValue == "") {
                setSearchDataVisible(false);
              }
              setSearchText(textInputValue);
            }}
          />
          <TouchableOpacity style={{ right: 10, position: "absolute" }} onPress={() => { setSearchText(''); setTextInputValue(""); setSearchDataVisible(false) }}>
            <Ionicons style={styles.iconStyling} name={'close'} size={25} color="grey" />
          </TouchableOpacity>
        </View>

        {searchDataVisible && <View style={styles.infoScreen}>
          <ScrollView style={styles.searchResults}>
            {active && searchData.map((item, index) => (
              <EventSearchView eventName={item.name} date={item.data} key={index} navigation={navigation} code={item.code} navigateTo={() => { navigation.navigate("EventInfoScreen") }} location='main' setInputText={setTextInputValue} setDataVisible={setSearchDataVisible} />
            ))}
            {!active && searchData.map((item, index) => (
              <TeamSearchView teamName={item.name} number={item.data} key={index} navigation={navigation} setInputText={setTextInputValue} setDataVisible={setSearchDataVisible}/>
            ))}
          </ScrollView>
        </View>}

        <CustomDropdown marginTop={10} marginBottom={10} dropdownValue={regionDropdown} setDropDownValue={setRegionDropdown} dropdownData={regionDropdownData} />


        <View style={{ marginTop: '3%', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#101010' }}>
          <View style={{ width: '27%', left: 0, height: 2.5, marginBottom: -5, backgroundColor: '#328AFF', borderRadius: 10 }} />
          <Text style={styles.headings}>Scouting</Text>
          <View style={{ width: '27%', right: 0, height: 2.5, marginBottom: -5, backgroundColor: '#328AFF', borderRadius: 10 }} />
        </View>

        <TouchableOpacity onPress={toggleShowCodeInput} style={styles.button}>
          <AntDesign name="pluscircleo" size={30} color="#328AFF" style={styles.icon} />
          <Text style={styles.buttonText}>Create Scouting Sheet</Text>
        </TouchableOpacity>

        <EventCodeInput navigation={navigation} modalVisible={showCodeInput} setModalVisible={setShowCodeInput} />

        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('MyScoutingSheetsScreen'); }}>
          <Ionicons name="document-text-outline" size={30} color="#328AFF" style={styles.icon} />
          <Text style={styles.buttonText}>My Scouting Sheets</Text>
        </TouchableOpacity>

        <View style={{ marginTop: '5%', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#101010' }}>
          <View style={{ width: '22.5%', left: 0, height: 2.5, marginBottom: -5, backgroundColor: '#328AFF', borderRadius: 10 }} />
          <Text style={styles.headings}>Favorites</Text>
          <View style={{ width: '22.5%', right: 0, height: 2.5, marginBottom: -5, backgroundColor: '#328AFF', borderRadius: 10 }} />
        </View>

        {bookmarks.map((item, index) => (
          item && 
          (
            <Bookmark name={item.name} code={item.code} key = {index} navigation={navigation} setToDelete={setBookmarkToDelete}></Bookmark>
          )
        ))}

        <DeleteBookmark modalVisible = {bookmarkModalVisible} setModalVisible={setBookmarkModalVisible} bookmarkToDelete= {bookmarkToDelete} updateBookmarks={setBookmarks}></DeleteBookmark>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: '#101010',
    flex: 1
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 40,
  },
  textInputContainer: {
    backgroundColor: '#191919',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    height: windowHeight / 17,
    borderRadius: 10,
    marginTop: '2.5%',
  },
  iconStyling: {
    position: 'relative',
  },
  input: {
    fontSize: 22,
    color: 'white',
    height: "100%",
    left: 38,
    flex: 1
  },
  headings: {
    fontSize: 30,
    color: 'white',
    paddingHorizontal: '2%',
  },
  text: {
    fontSize: 20,
    color: 'white'
  },
  dropDownText: {
    fontSize: 20,
    color: 'white'
  },
  button: {
    backgroundColor: '#191919',
    borderRadius: 10,
    marginTop: '5%',
    flexDirection: "row",
    alignItems: "center",
    width: '90%',
  },
  buttonText: {
    color: "white",
    flex: 1,
    fontSize: 20,
    paddingRight: '3.5%',
  },
  icon: {
    padding: '3.5%',
  },
  infoScreen: {
    backgroundColor: "#191919",
    alignSelf: "center",
    height: 190,
    width: "90%",
    borderRadius: 12
  },
  searchResults: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: '#191919',
  },
});