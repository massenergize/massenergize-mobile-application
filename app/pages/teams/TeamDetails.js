/******************************************************************************
 *                            TeamDetails
 * 
 *      This page is responsible for rendering the community team's 
 *      information as a component called TeamDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 11, 2024
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
  Spacer,
  FormControl,
  Modal,
  Icon
} from '@gluestack-ui/themed-native-base';
import React, { useState } from 'react';
import TeamCard from './TeamCard';
import Ionicons from "react-native-vector-icons/Ionicons";
import { TeamActionsChart, ActionsList } from '../../utils/Charts';
import { useDetails } from '../../utils/hooks';
import HTMLParser from '../../utils/HTMLParser';
import { connect } from 'react-redux';
import AuthOptions from '../auth/AuthOptions';
import { toggleUniversalModalAction, updateUserAction } from '../../config/redux/actions';
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '../../components/icons';
import { apiCall } from '../../api/functions';
import MEImage from '../../components/image/MEImage';

/* 
 * This serves as a validation schema to prevent the user to send a 
 * message to the team's administrator if all the required fields 
 * are not filled. 
 */
const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

function TeamDetails({ 
  route, 
  navigation, 
  user, 
  toggleUniversalModalAction,
  communityInfo
}) {
  /* Saves the community's ID into a variable */
  const community_id = communityInfo.id;

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

  /* 
   * Uses local state to determine if the message the user is sending
   * to the team's administrator and/or if it is in the process to being sent 
   * and/or if it was already sent. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* Evaluates if the user is part of the team */
  const inTeam = () => {
    if (!team || !user) return false;

    return user.teams.map(team => team.id).includes(team.id);
  };
  
  /* Allows the user to join  the team */
  const joinTeam = () => {
    if (!team) return;
    if (!user) {
      toggleUniversalModalAction({
        isVisible: true,
        Component: AuthOptions,
        title: 'How would you like to sign in or Join ?',
      });
      return;
    }
    if (inTeam()) {
      leaveTeam();
      return;
    }
    setIsJoinLoading(true);
  
    updateUserAction(
      "teams.join",
      { team_id: team.id, user_id: user.id },
      (response, error) => {
        if (error) return console.error("Failed to join team", error);
        console.log("JOINED TEAM");
        setIsJoinLoading(false);
      }
    );
  };
  
  /* Allows the user to leave the team */
  const leaveTeam = () => {
    if (!team || !user) return;
    setIsJoinLoading(true);

    updateUserAction(
      "teams.leave",
      { team_id: team.id, user_id: user.id },
      (response, error) => {
        if (error) return console.error("Failed to leave team", error);
        console.log("LEFT TEAM");
        setIsJoinLoading(false);
      }
    );
  };

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Send Message' button in the 'Contact' tab.
   */
  const handleSendMessage = (values, action) => {
    setIsSubmitting(true);
    const data = {
      community_id: community_id,
      team_id: team_id,
      title: values.subject,
      body: values.message
    };

    apiCall("teams.contactAdmin", data).then((response) => {
      setIsSubmitting(false);
      if (response.success && response.data) {
        console.log("Message sent");
        setIsSent(true);
      } else {
        console.log("Error sending message", response.error);
      }
    });

    action.resetForm();
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
      <Box style={{marginBottom: 30}}>
        <VStack space="2">
          <Text fontWeight="bold" fontSize="lg">
            Contact admin of this team
          </Text>
          <Formik
            initialValues={{
              subject: "",
              message: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSendMessage}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <VStack>
                <FormControl
                    mt={3}
                    isRequired
                    isInvalid={errors.subject && touched.subject}
                  >
                    <Input
                      variant="rounded"
                      size="lg"
                      placeholder="Subject"
                      onChangeText={handleChange("subject")}
                      onBlur={handleBlur("subject")}
                      value={values.subject}
                    />
                    {
                      errors.subject && touched.subject ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.subject}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <FormControl
                    mt={3}
                    isRequired
                    isInvalid={errors.message && touched.message}
                  >
                    <Input
                      size="lg"
                      borderRadius={25}
                      placeholder="Message"
                      textAlignVertical="top"
                      multiline={true}
                      height={40}
                      onChangeText={handleChange("message")}
                      onBlur={handleBlur("message")}
                      value={values.message}
                    />
                    {
                      errors.message && touched.message ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.message}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <Button
                    mt={3}
                    bg="primary.400"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    SEND MESSAGE
                  </Button>
              </VStack>
            )} 
          </Formik>

          <Modal isOpen={isSent} onClose={() => setIsSent(false)}>
            <Modal.Content maxWidth="400">
              <Modal.Body>
                <Center mb="5">
                    <FontAwesomeIcon name="paper-plane" size={90} color="green" />
                    <Text fontSize="lg" fontWeight="bold" py="5">
                      Message Sent!
                    </Text>
                    <Text textAlign="center">
                      The admin of {team.name} will get in touch with you soon!
                    </Text>
                </Center>
                <Button colorScheme={"gray"} onPress={() => setIsSent(false)}>
                    Back
                </Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
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

  /* Generates the Tab button component for each tab in the Details page */
  function TabButton({ label, name }) {
    return (
      <Button
        variant={activeTab === name ? "solid" : "outline"}
        onPress={() => setActiveTab(name)}
        mr={2}
      >
        {label}
      </Button>
    );
  }

  /* 
   * Generates the Tab button component for the Members tab specifically, 
   * since it is the only one that is different from the others for 
   * displaying the number of members in that Team or Subteam 
   */
  function TabButtonMembers() {
    return (
      <Button
        variant={activeTab === "members" ? "solid" : "outline"}
        onPress={() => setActiveTab("members")}
        mr={2}
      >
        {"Members (" + members.length + ")"}
      </Button>
    );
  }

  // console.log("team info: ", team);

  /* Displays the DetailsScreen of the Team of the community */
  return (
    <View>
      <ScrollView>
        {isTeamLoading || isMembersLoading ? (
          <Spinner />
        ) : (
          <View>
            {team.logo ? (
              <MEImage
                source={{ uri: team.logo.url }}
                altComponent={<></>}
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
                onPress={() => joinTeam()}
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
                    <TabButton label="About" name="about" />
                    <TabButton label="Actions" name="actions" />
                    <TabButtonMembers/>
                    {
                      subteams.length === 0 ? null :
                      <TabButton label="Sub-teams" name="subTeams" />
                    }
                    <TabButton label="Contact" name="contact" />
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

/* 
 * Transforms the local state of the app into the proprieties of the 
 * TeamDetails function, in which it is got from the API.
 */
const mapStateToProps = state => ({
  user: state.user,
  communityInfo: state.communityInfo,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the Upcoming proprieties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ toggleUniversalModalAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);