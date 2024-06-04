/******************************************************************************
 *                            TeamDetails
 * 
 *      This page is responsible for rendering the community team's 
 *      information as a component called TeamDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 4, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import {
  Center,
  Heading,
  Image,
  Text,
  HStack,
  Button,
  VStack,
  Box,
  ScrollView,
  Input,
  View,
  Spinner,
  Spacer
} from '@gluestack-ui/themed-native-base';
import React, { useState } from 'react';
import TeamCard from './TeamCard';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TeamActionsChart, ActionsList } from '../../utils/Charts';
import { useDetails } from '../../utils/hooks';
import HTMLParser from '../../utils/HTMLParser';
import { connect } from 'react-redux';
import { apiCall } from '../../api/functions';
import { bindActionCreators } from 'redux';
import { fetchAllUserInfo } from '../../config/redux/actions';
import MEButton from '../../components/button/MEButton';

function TeamDetails({ route, navigation, user, fetchAllUserInfo }) {
  // console.log(user);
  /* Gets the parameters passed when the function was called */
  const { team_id } = route.params;
  const { subteams } = route.params;
  const { team_stats } = route.params;

  /* Must load team info, members, and actions separately */
  const [team, isTeamLoading] = useDetails("teams.info", { team_id: team_id });
  const [members, isMembersLoading] = useDetails("teams.members.preferredNames", { team_id: team_id });
  const [actions, isActionsLoading] = useDetails("teams.actions.completed", { team_id: team_id });

  /* Update the button */
  const [isJoinLoading, setIsJoinLoading] = useState(false);

  /* Uses local state to inform which tab is currently selected */
  const [activeTab, setActiveTab] = useState("about");

  /* Evaluates if the user is part of the team */
  const inTeam = () => {
    if (!team || !user) return false;

    return user.teams.map(team => team.id).includes(team.id);
  };
  
  /* Allows the user to join  the team */
  const joinTeam = () => {
    if (!team || !user) return;
    setIsJoinLoading(true);
  
    apiCall('teams.join', { team_id: team.id, user_id: user.id })
      .then((response) => {
        if (!response.success) return console.error("Failed to join team", response);
        fetchAllUserInfo();
        console.log("Joined team");
        setIsJoinLoading(false);
      });
  };
  
  /* Allows the user to leave the team */
  const leaveTeam = () => {
    if (!team || !user) return;
    setIsJoinLoading(true);

    apiCall('teams.leave', { team_id: team.id, user_id: user.id })
      .then((response) => {
        if (!response.success) return console.error("Failed to leave team", response);
        fetchAllUserInfo();
        console.log("Left team");
        setIsJoinLoading(false);
      });
  };


  /* TODO: Cache these components to avoid re-rendering. */
  /* Creates the tabs */
  const generateAboutTab = () => {
    return <HTMLParser
      htmlString={team.description}
      baseStyle={textStyle}
    />
  };

  /* 
   * Uses the local state to determine which component of the Action 
   * graphs are currently being displayed: either in form of graph 
   * or in form of chart.
   */
  const [actionDisplay, setActionDisplay] = useState('chart');

  const getGraphData = () => {
    let graphData = {
      "Activism & Education": {
        "name": "Activism & Education",
        "value": 0
      },
      "Food": {
        "name": "Food",
        "value": 0,
      },
      "Home Energy": {
        "name": "Home Energy",
        "value": 0,
      },
      "Land, Soil & Water": {
        "name": "Land, Soil & Water",
        "value": 0,
      },
      "Solar": {
        "name": "Solar",
        "value": 0,
      },
      "Transportation": {
        "name": "Transportation",
        "value": 0,
      },
      "Waste & Recycling": {
        "name": "Waste & Recycling",
        "value": 0,
      }
    }

    /* 
     * If actions is a valid variable, then loop through the actions made
     * in the community and calculate all the values of each of type of 
     * action they performed. This is going to be used to generate a graph 
     * of chart when the user selects the action detail button. 
     */
    if (actions) {
      for (let i = 0; i < actions.length; i++) {
        if (graphData[actions[i].category]) {
          graphData[actions[i].category].value += actions[i].done_count;
        }
      }
    }

    return Object.values(graphData);
  }

  /* Generates the Tabs components of the Details screen */
  const generateActionsTab = () => {
    return (
      <VStack space="5">
        <Text style={{ alignSelf: 'center' }}>
          <Text fontWeight="bold">
            {team_stats.actions_completed}
          </Text>{" "}
          Actions Completed
        </Text>
        <Text alignSelf="center">
          <Text fontWeight="bold">{(team_stats.carbon_footprint_reduction / 133).toFixed(2)}</Text>{" "}
          Number of Trees
        </Text>
        <HStack width="100%">
          <Spacer />
          <Center>
            <Ionicons
              name={"bar-chart-outline"}
              color={actionDisplay == "chart" ? '#64B058' : 'black'}
              padding={5}
              size={24}
              onPress={() => setActionDisplay('chart')}
            />
          </Center>
          <Center pr={3}>
            <Ionicons
              name={"list-outline"}
              color={actionDisplay == "list" ? '#64B058' : 'black'}
              padding={5}
              size={24}
              onPress={() => setActionDisplay('list')}
            />
          </Center>
        </HStack>
        {
          (actionDisplay == "chart")
            ?
            <TeamActionsChart graphData={getGraphData()} />
            :
            <ActionsList listData={actions} />
        }
      </VStack>
    );
  };

  /* Generates the Members tab */
  const generateMembersTab = () => {
    return <VStack space="2">
      {
        members.map((member, i) => {
          return <Text fontSize="md" key={i}>{member.preferred_name}</Text>
        })
      }
    </VStack>;
  };

  /* Generates the Sub-teams tab */
  const generateSubTeamsTab = () => {
    return <VStack space="5">
      {
        subteams.map((subteam, i) => {
          return (
            <TeamCard navigation={navigation} team={subteam} isSubteam={true} key={i} />
          );
        })
      }
    </VStack>;
  };

  /* Generates the Contact tab */
  const generateContactTab = () => {
    return (
      <Box>
        <VStack space="2">
          <Text fontWeight="bold" fontSize="lg">
            Contact admin of this team
          </Text>
          <Input variant="rounded" placeholder='Subject' />
          <Input
            borderRadius={20}
            type="text"
            placeholder='Message'
            multiline
            numberOfLines={8}
          />
          <Button>Send Message</Button>
        </VStack>
      </Box>
    );
  };

  /* 
   * Calls on the 'Generate' function of whatever tab the user selected
   * to render its information. The default tab is the About tab.
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return generateAboutTab();
      case "actions":
        return generateActionsTab();
      case "members":
        return generateMembersTab();
      case "subTeams":
        return generateSubTeamsTab();
      case "contact":
        return generateContactTab();
      default:
        return generateAboutTab();
    }
  };

  /* Displays the DetailsScreen of the Team of the community */
  return (
    <View>
      <ScrollView>
        {isTeamLoading || isMembersLoading ? (
          <Spinner />
        ) : (
          <View>
            {team.logo ? (
              <Image
                source={{ uri: team.logo.url }}
                alt="image"
                height={200}
                mt={5}
                resizeMode="contain"
              />
            ) : null}
            <VStack space="3">
              <Heading alignSelf="center" mt={5}>{team.name}</Heading>
              <Button
                my={2}
                mx={4}
                onPress={inTeam() ?
                  () => leaveTeam()
                  : () => joinTeam()
                }
                style={{ backgroundColor: inTeam() ? 'red' : '#64B058' }}
                isDisabled={isJoinLoading}
              >
                {inTeam() ? "Leave Team" : "Join Team"}
              </Button>
              <Center mx="5">
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <HStack space="2">
                    <Button
                      variant={activeTab === "about" ? "solid" : "outline"}
                      onPress={() => setActiveTab("about")}
                    >
                      About
                    </Button>
                    <Button
                      variant={activeTab === "actions" ? "solid" : "outline"}
                      onPress={() => setActiveTab("actions")}
                    >
                      Actions
                    </Button>
                    <Button
                      variant={activeTab === "members" ? "solid" : "outline"}
                      onPress={() => setActiveTab("members")}
                    >
                      {"Members (" + members.length + ")"}
                    </Button>
                    {
                      subteams.length === 0 ? null :
                        <Button
                          variant={activeTab === "subTeams" ? "solid" : "outline"}
                          onPress={() => setActiveTab("subTeams")}
                        >
                          Sub-teams
                        </Button>
                    }
                    <Button
                      variant={activeTab === "contact" ? "solid" : "outline"}
                      onPress={() => setActiveTab("contact")}
                    >
                      Contact
                    </Button>
                  </HStack>
                </ScrollView>
              </Center>
              <Tab>
                {renderTabContent()}
              </Tab>
            </VStack>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* Generates a 'Tab' component used in the display member of the TeamDetails screen */
const Tab = ({ children }) => {
  return <Box p="5" >{children}</Box>
}

const textStyle = {
  fontSize: "16px",
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchAllUserInfo: fetchAllUserInfo,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);