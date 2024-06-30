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

type Team = {
    id: string,
    name: string,
    tot_opr: string,
    auto_opr: string,
    rank: string,
  };

const ScoutingSheet: React.FC<ScoutingSheetProps> = ({ navigation }) => {
  const [eventName, setEventName] = useState("");
  const [teamArray, setTeamArray] = useState<Team[]>([]);
  const eventCode = useSelector((state: any) => state.event.eventCode);
  const [displayStats, setDisplayStats] = useState("TOTAL");
  const [stats, setStats] = useState("TOTAL");
  const data = [
    { label: "AUTO", value: "AUTO" },
    { label: "TOTAL", value: "TOTAL" },
    {label : "RANK", value: "RANK"}
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
                }
                stats {
                    ... on TeamEventStats2023{
                        opr {
                            totalPointsNp
                            autoPoints
                        }
                        rank
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
        let formattedTeamArray: Team[] = [];
        teamArray.map((team: any) => {
          let opr: string = team.stats?.opr?.totalPointsNp ?? "0.000000";
          let auto_opr: string = team.stats?.opr?.autoPoints ?? "0.000000"
          let rank = team.stats?.rank ?? 999
          auto_opr = Number(auto_opr).toFixed(2)
          opr = Number(opr).toFixed(2)
          formattedTeamArray.push({ id: team.team.number, name: team.team.name, tot_opr: opr, auto_opr: auto_opr, rank: rank });
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
          {stats == "AUTO" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(b.auto_opr) - Number(a.auto_opr)).map((team) => (
            <TeamView teamName={team.id} teamNumber={team.name} shownValue={team.auto_opr} key={team.id} />
          ))}
          {stats == "TOTAL" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(b.tot_opr) - Number(a.tot_opr)).map((team) => (
            <TeamView teamName={team.id} teamNumber={team.name} shownValue={team.tot_opr} key={team.id} />
          ))}
          {stats == "RANK" && teamArray.filter(team => Number(team.rank) != 999).sort((a, b) => Number(a.rank) - Number(b.rank)).map((team) => (
            <TeamView teamName={team.id} teamNumber={team.name} shownValue={team.rank} key={team.id} />
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
    width: 120,
    padding : 6
  },
  placeholderText: {
    color: "white"
  },
});

export default ScoutingSheet;