/******************************************************************************
 *                            UserProfile
 * 
 *      This page is responsible for rendering the user's profile. It displays
 *      the user's name, sustainability score, carbon saved, to-do list,
 *      completed actions, teams, households, and communities.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useEffect, useContext, useCallback } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  Button,
  View,
  Text,
  Image,
  Box,
  Flex,
  ScrollView,
  Divider,
  VStack,
  Avatar,
  Center,
  Icon,
  Spinner,
  HStack,
  Pressable,
  Heading,
  Stack,
} from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ActionCard from "../actions/ActionCard";
import CommunityCard from "../community-select/CommunityCard";
import { getActionMetric } from "../../utils/common";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { fetchAllUserInfo, toggleUniversalModalAction } from "../../config/redux/actions";
import { bindActionCreators } from "redux";
import MEImage from "../../components/image/MEImage";
import AuthOptions from "../auth/AuthOptions";

const sumOfCarbonScores = (data) => {
  if (!data) return 0;
  return data
    .map((t) =>
      t.action && t.action.calculator_action
        ? t.action.calculator_action.average_points
        : 0
    )
    .reduce((partial_sum, a) => partial_sum + a, 0);
};

/* Component to display the user's name, preferred name, and community */
const ProfileName = ({ navigation, communityInfo, user }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Profile picture */}
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRir06bApyiBCEsxHMGNWtcxEZGCLYj5vdcxQ&usqp=CAU",
        }}
        alt="User avatar"
        size="20"
        rounded="full"
      />

      {/* User's name, preferred name, and community */}
      <Box alignItems="center">
        <Text fontSize="xl">{user.preferred_name || "Your Name"}</Text>
        <Text>{user.full_name}</Text>
        {/* <Text>{communityInfo.name}</Text> */}
      </Box>

      {/* Settings button */}
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Icon as={FontAwesome} name="cog" size="lg" />
      </Pressable>
    </Flex>
  );
};


/* Component to display the user's carbon saved, trees saved, and points */
const CarbonSaved = ({ CompletedList }) => {
  /* TODO: make this a real formula */
  const carbonSaved = sumOfCarbonScores(CompletedList);
  const actionsCompleted = CompletedList?.length ?? 0;

  return (
    <Flex flexDirection="row" justifyContent="space-evenly" width="full">
      <Box alignItems="center">
        <Text fontSize="lg" fontWeight="medium">
          {carbonSaved}
        </Text>
        <Text>Lbs CO2 Saved</Text>
      </Box>

      <Divider orientation="vertical" />
      <Box alignItems="center">
        <Text fontSize="lg" fontWeight="medium">
          {actionsCompleted}
        </Text>
        <Text>Actions Completed</Text>
      </Box>
    </Flex>
  );
};

/* 
 * Component to display a list of actions, either in the todo list 
 * or completed list.
 */
const ActionsList = ({ navigation, list, actions }) => {
  const actionList = list?.map(item => item.action);
  return (
    <Box>
      {/* <ActionsFilter /> */}
      <ScrollView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
            {actionList?.map((action, index) => {
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
            })}
          </HStack>
        </ScrollView>
      </ScrollView>
    </Box>
  );
};

/* Component to display a list of badges (not currently used) */
const BadgesList = () => {
  return (
    <Center>
      <Text fontSize="lg" fontWeight="bold" mb="5">
        Badges
      </Text>
      <Avatar.Group max={3}>
        <Avatar
          ACTION
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
        <Avatar
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
        <Avatar
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
        <Avatar
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
        <Avatar
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
        <Avatar
          bg="primary.400"
          size="lg"
          source={{
            uri: "https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg",
          }}
        >
          Monkey
        </Avatar>
      </Avatar.Group>
    </Center>
  );
};

/* Component to display a list of teams */
const TeamsList = ({ teams, navigation }) => {
  return (
    <Box>
      <Text alignSelf="center" bold fontSize="lg" mb="5">
        My Teams
      </Text>

      {
          teams?.length === 0 && 
          <Text
            fontSize="xs"
            textAlign="center"
            px={10}
            color="gray.400"
          >
            No teams yet!
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
                key={index}
              >
                <Box
                  width={200}
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

/* Component to display a list of houses */
const HousesList = ({ households }) => {
  return (
    <Center>

      <Text fontWeight="bold" fontSize="lg" mb="5">
        My Households
      </Text>

      {households?.length === 0 && <Text>No households yet!</Text>}

      {households?.map((household, index) => (
        <Flex width="full" key={index}>
          <Flex flexDirection="row" alignItems="center">
            <Icon as={FontAwesome} name="home" size="sm" />
            <Text px="2" flexGrow={1}>
              {household.name}
            </Text>
            <Icon as={FontAwesome} name="pencil" size="sm" />
          </Flex>
        </Flex>
      ))}
    </Center>
  );
};

/* Component to display a list of communities */
const CommunitiesList = ({ communities }) => {
  return (
    <Center>
      <Text fontWeight="bold" fontSize="lg" mb="5">
        My Communities
      </Text>
      <View 
        bg="white" 
        shadow={2} 
        p={2} 
        borderRadius={8}>
        {communities?.length === 0 && <Text>No communities yet!</Text>}
        {communities?.map((community, index) => (
          <CommunityCard
            key={index}
            {...community}
          />
        ))}
      </View>
    </Center>
  );
};

/* Main component */
function DashboardPage({
  navigation,
  route,
  communityInfo,
  actions,
  completedList,
  todoList,
  user,
  fetchAllUserInfo,
  toggleModal,
}) {
  /* If user is not logged in, display a message */
  if (!user) {
    return (
      <View style={{
        display: 'flex',
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center'
      }}>
        <Center space="5">
          <Text 
            fontSize="xs"
            px={10}
            color="gray.400"
          >
            Sign in to view Profile
          </Text>

          <Button
            onPress={() => toggleModal({
              isVisible: true,
              Component: AuthOptions,
              title: 'How would you line to sign in or Join?',
            })}
          >
            Log In or Sign Up
          </Button>
        </Center>
      </View>
    );
  }

  /* Reloads the user's info when the page is opened */
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchAllUserInfo(() => setRefreshing(false));

    }, [])
  );

  /* If the page is still loading, display a loading message */
  if (refreshing) {
    return (
      <View style={{
        display: 'flex',
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center'
      }}>
        <Center>
          <Spinner />
          <Text>Loading...</Text>
        </Center>
      </View>
    );
  }

  return (
    <GestureHandlerRootView backgroundColor="white" flex="1">
      <ScrollView padding="5"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <VStack space={10} mb="20">
          <ProfileName navigation={navigation} communityInfo={communityInfo} user={user} />
          <CarbonSaved CompletedList={completedList} />

          {/* Action lists */}
          {todoList !== null && todoList.length > 0 &&
            <>
              <Text style={styles.category}>To-do list</Text>
              <ActionsList navigation={navigation} list={todoList} actions={actions} />
            </>
          }
          {completedList?.length > 0 &&
            <>
              <Text style={styles.category}>Completed Actions</Text>
              <ActionsList navigation={navigation} list={completedList} actions={actions} />
            </>
          }

          {/* Other lists */}
          <TeamsList teams={user.teams} navigation={navigation} />
          <HousesList households={user.households} />
          <CommunitiesList communities={user.communities} />

        </VStack>
      </ScrollView>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  scroll: {
    height: "80",
  },
  category: {
    paddingHorizontal: 10,
    marginVertical: 5,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
});

/* 
 * Transforms the local state of the app into the properties of the 
 * DashboardPage function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    communityInfo: state.communityInfo,
    todoList: state.userTodo,
    completedList: state.userCompleted,
    householdList: state.userHouseholds,
    teamList: state.userTeams,
    user: state.user,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the DashboardPage properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchAllUserInfo: fetchAllUserInfo,
      toggleModal: toggleUniversalModalAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
