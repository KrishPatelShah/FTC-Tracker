import React, { useEffect, useState, } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { global_styles } from '@/styles';
import { useSelector } from 'react-redux';
import TeamView from '@/teamScoutingView';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';

type ScoutingSheetProps = {
  navigation: any;
};

const ScoutingSheet: React.FC<ScoutingSheetProps> = ({ navigation }) => {
  const [eventName, setEventName] = useState("");
  const [teamArray, setTeamArray] = useState([
    { id: '1', name: 'Team 1', tot_opr: "0", auto_opr: "0"},
    { id: '2', name: 'Team 2', tot_opr: "0", auto_opr: "0"},
    { id: '3', name: 'Team 3', tot_opr: "0", auto_opr: "0"},
    { id: '4', name: 'Team 4', tot_opr: "0", auto_opr: "0"},
  ]);
  const eventCode = useSelector((state: any) => state.event.eventCode);
  const [displayStats, setDisplayStats] = useState("total");
  const [stats, setStats] = useState("total");
  const data = [
    { label: "auto", value: "auto" },
    { label: "total", value: "total" },
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      if (eventCode) {
        const query = `
          query getEventByCode($season: Int!, $code: String!) {
            eventByCode(season: $season, code: $code) {
              name
              teams {
                team {
                  number
                  name
                  quickStats(season: $season) {
                    tot {
                      value
                    }
                    auto {
                      value
                    }
                  }
                }
              }
            }
          }`;
        
        const response = await fetch("https://api.ftcscout.org/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query, variables: { season: 2023, code: eventCode } })
        });
        const data = await response.json();
        //console.log(data.data.eventByCode.teams)
        let teamArray = data.data.eventByCode.teams;
        let formattedTeamArray: { id: any; name: any; tot_opr: any; auto_opr: any }[] = [];
        teamArray.map((team: any) => {
            console.log(team.team.quickStats)
          let opr: string = team.team.quickStats?.tot.value ?? "0.000000";
          let auto_opr: string = team.team.quickStats?.auto.value ?? "0.000000"
          formattedTeamArray.push({ id: team.team.number, name: team.team.name, tot_opr: opr, auto_opr: auto_opr });
        });
        setTeamArray(formattedTeamArray);
        setEventName(data.data.eventByCode.name);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchEventData();
    });

    return unsubscribe;
  }, [navigation, eventCode]);

  return (
    <GestureHandlerRootView>
      <View style={styles.screen}>
        <Text style={styles.eventName}>{eventName}</Text>
        <View style={styles.headerContainer}>
          <Text style={styles.headings}>Teams</Text>
          <Dropdown
            style={styles.dropdown}
            placeholder={displayStats}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.placeholderText}
            data={data}
            labelField="label"
            valueField="value"
            onChange={item => {
              setStats(item.value);
              setDisplayStats(item.value);
            }}
          />
        </View>
        <ScrollView style={styles.teamScroller} contentContainerStyle={styles.teamScrollerContainer}>
          {stats == "auto" && teamArray.map((team) => (
            <TeamView teamName={team.id} teamNumber={team.name} shownValue={team.auto_opr} key={team.id} />
          ))}
          {stats == "total" && teamArray.map((team) => (
            <TeamView teamName={team.id} teamNumber={team.name} shownValue={team.tot_opr} key={team.id} />
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#101010",
    justifyContent: "flex-start",
    padding: 20,
    alignItems: "center"
  },
  eventName: {
    paddingTop: 60,
    color: "white",
    fontSize: 32
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    justifyContent: 'space-between'
  },
  headings: {
    color: "white",
    fontSize: 22
  },
  teamScroller: {
    display: "flex",
    flexDirection: "column",
    top: 20,
    height: 540,
    width: 360,
    flexGrow: 0,
    backgroundColor: "#328AFF",
    borderRadius: 10
  },
  teamScrollerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    width: 120
  },
  placeholderText: {
    color: "white"
  },
});

export default ScoutingSheet;