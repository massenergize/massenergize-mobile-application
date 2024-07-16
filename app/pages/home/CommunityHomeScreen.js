/******************************************************************************
 *                       CommunityHomeScreen
 * 
 *      This page is responsible for rendering the Community home
 *      screen of the app. It features the actions taken by the
 *      community through graphs and displays the featured events
 *      of the community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 16, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState, useCallback, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Spacer,
  Pressable,
  View,
  ScrollView,
  Center,
  Heading,
  Image,
  AspectRatio,
  Spinner,
  Icon
} from '@gluestack-ui/themed-native-base';
import Carousel from 'pinar';
import ActionCard from '../actions/ActionCard';
import EventCard from '../events/EventCard';
import { SmallChart } from '../../utils/Charts';
import { formatDateString } from '../../utils/Utils';
import { getActionMetric } from '../../utils/common';
import { 
  fetchAllCommunityData, 
  toggleUniversalModalAction 
} from '../../config/redux/actions';
import { connect } from 'react-redux';
import { useDetails } from '../../utils/hooks';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '../../components/icons';
import { bindActionCreators } from 'redux';
import AuthOptions from '../auth/AuthOptions';

/* Defines the colors of the three charts of the impact of the community */
const colors = ["#DC4E34", "#64B058", "#000000"];

/* Card that shows up to three goals on the community page */
function GoalsCard({ navigation, goals, community_id }) {
  /* Creates the list of progress charts to display */
  const getGoalsList = () => {
    let goalsList = [];

    /* Don't display a chart if the goal is 0 */
    if (goals.target_number_of_actions != 0) {
      goalsList.push({
        nameLong: "Individual Actions Completed",
        nameShort: "Actions",
        goal: goals.target_number_of_actions,
        current: goals.displayed_number_of_actions
      });
    }

    if (goals.target_number_of_households != 0) {
      goalsList.push({
        nameLong: "Households Taking Action",
        nameShort: "Households",
        goal: goals.target_number_of_households,
        current: goals.displayed_number_of_households
      });
    }

    if (goals.target_carbon_footprint_reduction != 0) {
      goalsList.push({
        nameLong: "Carbon Reduction Impact",
        nameShort: "Carbon",
        goal: goals.target_carbon_footprint_reduction / 133,
        current: (goals.displayed_carbon_footprint_reduction / 133)
      });
    }

    return goalsList;
  }

  /* Render a pressable card with progress charts for the available goals */
  if (getGoalsList().length != 0) {
    return (
      <Pressable
        onPress={() => navigation.navigate("Impact", {
          goalsList: getGoalsList(),
          community_id: community_id
        })}
        mx={4}
        width="100%"
      >
        <Box
          shadow="1"
          bg="white"
          alignItems="center"
          rounded="xl"
          p={3}
          mx={4}
        >
          <HStack
            justifyContent="space-evenly"
            width="100%"
          >
            {
              getGoalsList().map((goal, index) => {
                return <SmallChart 
                          goal={goal}
                          color={colors[index]} 
                          key={index}
                        />
              })
            }
          </HStack>

          <Text
            alignSelf="flex-end"
            mr={2}
            fontSize="sm"
            color="primary.400"
            mt={2}
          >
            Show More {">"}
          </Text>
        </Box>
      </Pressable>
    );
  } else {
    return <></>
  }
}

/* Component that displays a Header in the app, similar to a HTML <h1/> */
function HeaderText({ text }) {
  return (
    <Text
      bold
      fontSize="xl"
      ml={4}
    >
      {text}
    </Text>
  );
}

/* 'Show More' button displayed next to header */
function ShowMore({ navigation, page, text }) {
  return (
    <Text
      fontSize="sm"
      color="primary.400"
      mr={4}
      onPress={() => navigation.navigate(page)}
    >
      {text}
    </Text>
  );
}

/* 
 * Component that creates a Carousel that displays images of actions 
 * and events hosted by the community
 */
function BackgroundCarousel({ data }) {
  return (
    <Box height="100%" bgColor={"amber.100"}>
      <Carousel
        showsControls={false}
        showsDots={false}
        autoplay={true}
        loop={true}
      >
        {data.map((item) => (
          <View key={item.id} flex={1} backgroundColor={"amber.400"}>
            <AspectRatio width="100%" backgroundColor={"amber.700"}>
              <Image source={{ uri: item.url }} alt={item.name} />
            </AspectRatio>
          </View>
        ))}
      </Carousel>

      {/* Background Overlay */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        backgroundColor="black"
        opacity={0.3}
      ></Box>
    </Box>
  );
}

const CommunityHomeScreen = ({
  navigation,
  communityInfo,
  actions,
  fetchAllCommunityData,
  fireAuth,
  toggleModal,
  questionnaire
}) => {
  /* Saves the community's ID into a variable */
  const community_id = communityInfo.id;
  /* Uses local state to determine if the app is refreshing or no */
  const [refreshing, setRefreshing] = useState(false);

  /* Fetch the information from the community */
  useEffect(() => {
    fetchAllCommunityData({ community_id: communityInfo.id });
  }, [fetchAllCommunityData, communityInfo.id]);

  /* Fetches the community information when the app is refreshing */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllCommunityData({ community_id: communityInfo.id }, () => setRefreshing(false));
  }, [communityInfo.id, fetchAllCommunityData]);

  /* Gets the homeSettings information from the API */
  const [homeSettings, isLoading] = useDetails('home_page_settings.info', { community_id });

  /* When the app is loading, display an activity indicator */
  if (isLoading) {
    return (
      <View height="100%" bg="white">
        <Center flex="1">
          <Spinner/>
        </Center>
      </View>
    );
  }

  /* Function that renders the User's Preferences button */
  const renderPreferences = () => {
    return (
      <Pressable
        onPress={() => {
          if (fireAuth) {
            navigation.navigate("Questionnaire");
          } else {
            toggleModal({
              isVisible: true,
              Component: AuthOptions,
              title: 'How would you like to sign in or Join?',
            })
          }
        }}
        mx={4}
        width="100%"
      >
        <Box
          shadow="1"
          bg="white"
          alignItems="center"
          rounded="xl"
          p={3}
          mx={4}
          borderWidth={1}
          borderColor="primary.400"
        >
          <HStack alignItems="center" gap="1">
            <Icon
              as={FontAwesomeIcon}
              name="cog"
              size="lg"
              color="primary.600"
              mx={2}
            />

            <VStack>
              <Text bold fontSize="lg">Complete Your Preferences</Text>
              <Text fontSize="sm" color="gray.500">
                Help us tailor recommendations to you!
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    );
  }

  /* Displays the community home screen and its information */
  return (
    <View bg="white">
      <ScrollView 
      nestedScrollEnabled = {true} 
      showsVerticalScrollIndicator={false}
      >
        <Box 
          maxHeight={[200, 300]} 
          width="100%"
        >
          <Center 
            position="absolute" 
            zIndex={1} 
            height="100%" 
            width="100%" 
            px="2"
          >
            <Heading 
              color="white" 
              fontWeight="bold" 
              size="xl" 
              textAlign="center"
            >
              {communityInfo.name}
            </Heading>

            <Text 
              color="white" 
              textAlign="center" 
              fontSize={["xs", "sm"]}
              px={8}
            >
              {homeSettings.sub_title}
            </Text>
          </Center>

          <BackgroundCarousel data={homeSettings.images} />
        </Box>

        <VStack 
          alignItems="center" 
          space={3} 
          bg="white" 
          top="-3%" 
          borderTopRadius={30} 
          pt="5"
        >
          <GoalsCard 
            navigation={navigation} 
            goals={communityInfo.goal} 
            community_id={community_id} 
          />

          {/* User preferences card */}
          { !questionnaire && renderPreferences() }
          
          <HStack alignItems="center" pb={2} pt={3}>
            <HeaderText text="Recommended Actions"/>
            <Spacer/>
            <ShowMore navigation={navigation} page="Actions" text={"Show More"}/>
          </HStack>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
            {
              /* 
               * Displays all low cost actions for v1 (recommended in 
               * the future) 
               */
              actions
              .filter((action) => getActionMetric(action, "Cost") === "$" || 
                                  getActionMetric(action, "Cost") === "0")
              .map((action, index) => {
              return (
                <ActionCard
                  key={index}
                  navigation={navigation}
                  id={action.id}
                  title={action.title}
                  imgUrl={action.image?.url}
                  impactMetric={getActionMetric(action, "Impact")}
                  costMetric={getActionMetric(action, "Cost")}
                />
              );
              })
            }
            </HStack>
          </ScrollView>
          { homeSettings.show_featured_events && 
            homeSettings.featured_events.length !== 0 && (
            <View width="100%">
              <HStack alignItems="center" pb={2} pt={3}>
                <HeaderText text="Featured Events"/>
                <Spacer/>
                <ShowMore navigation={navigation} page="Events" text={"Show More"}/>
              </HStack>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <HStack space={3} mx={15}>
                  {homeSettings.featured_events.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.name}
                      date={formatDateString(
                        new Date(event.start_date_and_time),
                        new Date(event.end_date_and_time)
                      )}
                      location = {event.location}
                      imgUrl={event.image?.url}
                      canRSVP={event.rsvp_enabled}
                      isRSVPED={event.is_rsvped}
                      isShared={event.is_shared}
                      id={event.id}
                      navigation={navigation}
                      my={3}
                      shadow={3}
                    />
                  ))}
                </HStack>
              </ScrollView>
            </View>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  activity: {
    alignSelf: 'center',
    marginTop: 300
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * CommunityHomeScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    communityInfo: state.communityInfo,
    events: state.events,
    actions: state.actions,
    fireAuth: state.fireAuth,
    questionnaire: state.questionnaire,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the CommunityHomeScreen properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleModal: toggleUniversalModalAction,
    fetchAllCommunityData,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityHomeScreen);