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
} from 'native-base';
import { RefreshControl } from 'react-native-gesture-handler';
import Carousel from 'pinar';
import ActionCard from '../actions/ActionCard';
import EventCard from '../events/EventCard';
import { SmallChart } from '../../utils/Charts';
import { formatDateString } from '../../utils/Utils';
import { getActionMetric } from '../../utils/common';
import { fetchAllCommunityData } from '../../config/redux/actions';
import { connect } from 'react-redux';
import { useDetails } from '../../utils/hooks';
import { ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const colors = ["#DC4E34", "#64B058", "#000000"];

function GoalsCard({ navigation, goals, community_id }) {
  const getGoalsList = () => {
    let goalsList = [];

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
        nameShort: "Trees",
        goal: goals.target_carbon_footprint_reduction / 133,
        current: (goals.displayed_carbon_footprint_reduction / 133)
      });
    }

    return goalsList;
  }

  if (getGoalsList().length != 0) {
    return (
      <Pressable
        onPress={() => navigation.navigate("impact", {
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
                return <SmallChart goal={goal} color={colors[index]} key={index}/>
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

function BackgroundCarousel({ data }) {
  return (
    <Box
      height="100%"
      bgColor={"amber.100"}
    >
      <Carousel
        showsControls={false}
        showsDots={false}
        autoplay={true}
        loop={true}
      >
        {data.map((item) => (
          <View
            key={item.id}
            flex={1}
            backgroundColor={"amber.400"}
          >
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
        backgroundColor={"black"}
        opacity="30"
      ></Box>
    </Box>
  );
}

const CommunityHomeScreen = ({
  navigation, 
  communityInfo,
  actions,
  fetchAllCommunityData
}) => {
  const community_id = communityInfo.id;  // Correctly reference community_id
  const [refreshing, setRefreshing] = useState(false);

  /* Fetch the information from the community */
  useEffect(() => {
    fetchAllCommunityData({ community_id: communityInfo.id });
  }, [fetchAllCommunityData, communityInfo.id]); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllCommunityData({ community_id: communityInfo.id }, () => setRefreshing(false));
  }, [communityInfo.id, fetchAllCommunityData]);

  const [homeSettings, isLoading] = useDetails('home_page_settings.info', { community_id });

  console.log('communityInfo: ', communityInfo);
  console.log('homeSettings: ', homeSettings);
  console.log('actions: ', actions);

  if (isLoading) {
    return <ActivityIndicator size={"large"} color="#DC4E34" style={styles.activity} />
  }

  return (
    <View>
      <ScrollView 
      nestedScrollEnabled = {true} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
          <Box maxHeight={[200, 300]} width="100%">
            <Center position="absolute" zIndex={1} height="100%" width="100%" px="2">
              <Heading color="white" fontWeight="bold" size="xl" textAlign="center">{communityInfo.name}</Heading>
              <Text color="white" textAlign="center" fontSize={["xs", "sm"]}>{homeSettings.sub_title}</Text>
            </Center>
            <BackgroundCarousel data={homeSettings.images} />
          </Box>
        <VStack alignItems="center" space={3} bg="white" top="-3%" borderTopRadius={30} pt="5">
          <GoalsCard navigation={navigation} goals={communityInfo.goal} community_id={community_id}/>
          <HStack alignItems="center" pb={2} pt={3}>
            <HeaderText text="Recommended Actions"/>
            <Spacer/>
            <ShowMore navigation={navigation} page="ACTIONS" text={"Show More"}/>
          </HStack>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
            {
              // displaay all low cost actions for v1 (recommended in the future)
              actions
              .filter((action) => getActionMetric(action, "Cost") === "$" || getActionMetric(action, "Cost") === "0")
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
          {homeSettings.show_featured_events && homeSettings.featured_events.length !== 0 && (
            <View width="100%">
              <HStack alignItems="center" pb={2} pt={3}>
                <HeaderText text="Featured Events"/>
                <Spacer/>
                <ShowMore navigation={navigation} page="EVENTS" text={"Show More"}/>
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
                      imageUrl={event.image?.url}
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
 * Upcoming function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
	communityInfo: state.communityInfo,
	events: state.events,
  actions: state.actions,
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the Upcoming properties.
 */
const mapDispatchToProps = {
	fetchAllCommunityData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityHomeScreen);