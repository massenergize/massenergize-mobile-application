/******************************************************************************
 *                            TeamsScreen
 * 
 *      This page is responsible for rendering the screen that
 *      displays the teams and sub-teams of a community, how many
 *      actions they performed, and their team members.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 4, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import {
  ScrollView,
  VStack,
  HStack,
  View,
  Pressable,
  Text,
  Spacer,
  Center,
  Spinner
} from '@gluestack-ui/themed-native-base';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllCommunityData } from '../../config/redux/actions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TeamCard from './TeamCard';


const TeamsScreen = ({ navigation, communityInfo, teams, fetchAllCommunityData }) => {
  /*
   * Uses local state to determine wheter the information about the community
   * is still loading, if the sub-team expland button is selected, and gets 
   * the information about each sub-team of the teams of the community.
   */
  const [isLoading, setIsLoading] = useState(true);
  const [subteamsExpanded, setSubteamsExpanded] = useState({});
  const [teamsList, setTeamsList] = useState([]);

  /* Fetch the information from the community */
  useEffect(() => {
    fetchAllCommunityData({ community_id: communityInfo.id });
  }, [fetchAllCommunityData, communityInfo.id]);

  /* Fetch the information from each team/sub-team */
  useEffect(() => {
    if (teams) {
      getTeams();
    }
  }, [teams]);

  /* If the information of the team is not available, display message */
  if (!teams) {
    return (
      <View style={styles.noInfoContainer}>
        <Text style={styles.noInfoText}>No Teams information :(</Text>
      </View>
    );
  }
  
  /* Gets a list of teams where subteams are nested under their parent team */
  const getTeams = () => {
    const teamsDict = {};
    const expanded = {};

    for (let i = 0; i < teams.length; i++) {
      if (teams[i].team.parent === null) {
        teamsDict[teams[i].team.id] = teams[i];
        teamsDict[teams[i].team.id].subteams = [];
      }
    }

    for (let i = 0; i < teams.length; i++) {
      if (teams[i].team.parent) {
        teamsDict[teams[i].team.parent.id].subteams.push(teams[i]);
        expanded[teams[i].team.id] = false;
      }
    }

    setTeamsList(Object.values(teamsDict));
    setSubteamsExpanded(expanded);
    setIsLoading(false);
  };

  /* 
   * If the sub-team expand button is selected, it is possible to either
   * expand it or undo the expand.
   */
  const changeExpanded = (team_id) => {
    const copy = { ...subteamsExpanded };
    copy[team_id] = !copy[team_id];
    setSubteamsExpanded(copy);
  };

  /* Displays the community's team/sub-teams information */
  return (
    <View>
      {isLoading ? (
        <Center flex={1}>
          <Spinner />
        </Center>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} p={5}>
            {teamsList.map((team, i) => {
              return (
                <View key={i}>
                  <TeamCard
                    navigation={navigation}
                    team={team}
                    isSubteam={false}
                  />
                  {
                  /* Display the subteams associated with a parent if expanded */
                  team.subteams.length > 0 && (
                    <View>
                      <Pressable onPress={() => changeExpanded(team.team.id)}>
                        <HStack mt={2} alignItems="center">
                          <Spacer />
                          <Text color="primary.600" mr={1}>
                            Expand Subteams
                          </Text>
                          <Ionicons
                            name={
                              subteamsExpanded[team.team.id]
                                ? "chevron-up-outline"
                                : "chevron-down-outline"
                            }
                            color="#64B058"
                          />
                        </HStack>
                      </Pressable>
                      {subteamsExpanded[team.team.id] && (
                        <VStack ml={5} space={3} mt={3}>
                          {team.subteams.map((subteam, j) => {
                            return (
                              <TeamCard
                                key={j}
                                navigation={navigation}
                                team={subteam}
                                isSubteam={true}
                              />
                            );
                          })}
                        </VStack>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noInfoContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64B058',
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * TeamsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
  communityInfo: state.communityInfo,
  teams: state.teamsStats,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the Upcoming properties.
 */
const mapDispatchToProps = {
  fetchAllCommunityData,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);
