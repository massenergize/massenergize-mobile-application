/******************************************************************************
 *                            TeamsScreen
 * 
 *      This page is responsible for rendering the screen that
 *      displays the teams and sub-teams of a community, how many
 *      actions they performed, and their team members.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 28, 2024
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
  Spinner, 
  Button,
  Box,
  Stack,
  Heading,
} from '@gluestack-ui/themed-native-base';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TeamCard from './TeamCard';
import { bindActionCreators } from 'redux';
import { toggleUniversalModalAction } from '../../config/redux/actions';
import AuthOptions from '../auth/AuthOptions';
import { fetchAllUserInfo, fetchUserProfile } from "../../config/redux/actions";
import MEImage from '../../components/image/MEImage';

const TeamsScreen = ({ navigation, teams, fireAuth, toggleModal, user }) => {
  /*
   * Uses local state to determine wheter the information about the community
   * is still loading, if the sub-team expland button is selected, and gets 
   * the information about each sub-team of the teams of the community.
   */
  const [isLoading, setIsLoading] = useState(true);
  const [subteamsExpanded, setSubteamsExpanded] = useState({});
  const [teamsList, setTeamsList] = useState([]);

  /* Fetch the information from each team/sub-team */
  useEffect(() => {
    if (teams) {
      getTeams();
      setIsLoading(false);
    }
  }, [teams]);

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

  /* Function that renders the 'Add Team' button */
  const renderAddTeam = () => {
    return (
      <Button
        title="Add Team"
        onPress={() => {
          if (fireAuth) navigation.navigate("AddTeam");
          else {
            toggleModal({
              isVisible: true,
              Component: AuthOptions,
              title: 'How would you like to sign in or Join?',
            });
          }
        }}
        m={5}
        px={10}
      >
        Add Team
      </Button>
    );
  };

  /* Component to display a list of teams the user is part of */
  const TeamsList = ({ teams, navigation }) => {
    return (
      <Box>
        <Heading mb={5} alignSelf="center">My Teams</Heading>

        {
          teams?.length === 0 && 
          <Text
            fontSize="xs"
            textAlign="center"
            px={10}
            color="gray.400"
          >
            You have not joined any teams. 
            Explore the teams in this community below.
          </Text>
        }

        <ScrollView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <HStack
              space={2}
              justifyContent="center"
              mx={15}
              marginBottom={15}
            >
              {teams?.map((team, index) => (
                <Pressable
                  onPress={() => navigation.navigate("TeamDetails", {
                    team_id: team.id,
                    team_stats: team,
                    subteams: team.subteams ? team.subteams : [],
                  })}
                >
                  <Box
                    key={index}
                    width={200}
                    height={250}
                    borderRadius={8}
                    bg="white"
                    shadow={2}
                  >
                    {/* Team's Logo */}
                    <MEImage
                      source={{ uri: team.logo?.url }}
                      alt={team.name}
                      borderTopRadius="xl"
                      resizeMode="cover"
                      height={120}
                      bg="gray.300"
                      altComponent={
                        <Box 
                          height={120} 
                          bg="gray.300" 
                          borderTopRadius="xl" 
                        />
                      }
                    />

                    {/* Team's name and tagline or description */}
                    <Stack p={3} space={3}>
                      <Stack space={2}>
                        <Heading
                          size="sm"
                        > 
                          {team.name} 
                        </Heading>
                        
                        {team.tagline !== "" ? (
                          <Text
                            fontSize="xs"
                            fontWeight="500"
                          >
                            {team.tagline}
                          </Text>
                        ) : (
                          <Text
                            fontSize="xs"
                            fontWeight="500"
                            isTruncated={true}
                            noOfLines={1}
                          >
                            {team.description}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>
        </ScrollView>
      </Box>
    );
  };

  /* Displays the community's team/sub-teams information */
  return (
    <View bg="white" height="100%">
      {isLoading ? (
        <Center flex={1}>
          <Spinner />
        </Center>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} p={5}>
            {
              renderAddTeam()
            }

            {
              /* Displays the list of teams/subteams the user is part of */
              <TeamsList teams={user.teams} navigation={navigation} />
            }

            {/* Display all community's teams and sub-teams */}
            <Heading mb={2} alignSelf="center">All Teams</Heading>
            { teamsList.length === 0 ? (
              <View>
                <Text fontSize="xs"
                  textAlign="center"
                  px={10}
                  color="gray.400"
                >
                  There are curently no Teams in this community. 
                  You can create the first one!
                </Text>
              </View>
            ) : ( 
              teamsList.map((team, i) => {
              return (
                <View key={i}>
                  <TeamCard
                    navigation={navigation}
                    team={team}
                    isSubteam={false}
                  />

                  {
                  /* 
                   * Display the subteams associated with a parent if 
                   * expanded.
                   */
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
            }))}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noInfoContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInfoText: {
    fontSize: 18,
    color: '#DC4E34',
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * TeamsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    teams: state.teamsStats,
    fireAuth: state.fireAuth,
    teamList: state.userTeams,
    user: state.user,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the Upcoming properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleModal: toggleUniversalModalAction,
    fetchAllUserInfo: fetchAllUserInfo,
    fetchUserProfile: fetchUserProfile
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsScreen);
