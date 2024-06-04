import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useEffect, useContext, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
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
} from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ActionCard from "../actions/ActionCard";
import CommunityCard from "../community-select/CommunityCard";
// import ActionsFilter from "../ActionsPage/ActionsFilter";
import { getActionMetric } from "../../utils/common";
import { RefreshControl } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { apiCall } from "../../api/functions";
import { connect } from "react-redux";
// import { convertAbsoluteToRem } from "native-base/lib/typescript/theme/tools";


const ProfileName = ({ navigation, communityInfo, userName }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRir06bApyiBCEsxHMGNWtcxEZGCLYj5vdcxQ&usqp=CAU",
        }}
        alt="User avatar"
        size="20"
        rounded="full"
      />
      <Box alignItems="center">
        <Text fontSize="xl">{userName || "Your Name"}</Text>
        <Text>{communityInfo.name}</Text>
      </Box>
      <Pressable onPress={() => navigation.navigate("settings")}>
        <Icon as={FontAwesome} name="cog" size="lg" />
      </Pressable>
    </Flex>
  );
};

const SustainScore = ({CompletedList}) => {
  const CarbonSaved = CompletedList.length; // TODO: make this a real formula
  return (
    <Box>
      <Text fontSize="4xl" color="primary.400" textAlign="center">
        {parseFloat(50.0 + (Math.sqrt(100 + CarbonSaved * 20))).toFixed(1)}
      </Text>
      <Text fontSize="lg" fontWeight="light" textAlign="center">
        Sustainability Score
      </Text>
    </Box>
  );
};

const CarbonSaved = ({ CompletedList }) => {
  const CarbonSaved = CompletedList.length; // TODO: Make this a real formula

  return (
    <Flex flexDirection="row" justifyContent="space-evenly" width="full">
      <Box alignItems="center">
        <Text fontSize="lg" fontWeight="medium">
          {CarbonSaved}
        </Text>
        <Text>CO2 Saved</Text>
      </Box>
      <Divider orientation="vertical" />
      <Box alignItems="center">
        <Text fontSize="lg" fontWeight="medium">
          {CarbonSaved / 10}
        </Text>
        <Text>Trees</Text>
      </Box>
      <Divider orientation="vertical" />
      <Box alignItems="center">
        <Text fontSize="lg" fontWeight="medium">
          {CarbonSaved * 10}
        </Text>
        <Text>Points</Text>
      </Box>
    </Flex>
  );
};

const ActionsList = ({ navigation, list, actions }) => {

  const todoList = list.map(item => item.action);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (todoList) {
      setIsLoading(false);
    }
  }, []);

  return (
    <Box>
      {/* <ActionsFilter /> */}
      <ScrollView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <HStack space={2} justifyContent="center" mx={15} marginBottom={15}>
            {todoList.map((action, index) => {
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

const TeamsList = ({ teams }) => {
  return (
    <Center>
      <Text fontWeight="bold" fontSize="lg" mb="5">
        My Teams
      </Text>
      {teams.length === 0 && <Text>No teams yet!</Text>}
      {teams.map((team, index) => (
        <Flex width="full" key={index}>
          <Flex flexDirection="row" alignItems="center">
            <Icon as={FontAwesome} name="home" size="sm" />
            <Text px="2" flexGrow={1}>
              {team.name}
            </Text>
            <Icon as={FontAwesome} name="pencil" size="sm" />
          </Flex>
        </Flex>
      ))}
    </Center>
  );
};

const HousesList = ({ households }) => {
  return (
    <Center>
      <Text fontWeight="bold" fontSize="lg" mb="5">
        My Households
      </Text>
      {households.map((household, index) => (
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

const CommunitiesList = ({ communities }) => {

  return (
    <Center>
      <Text fontWeight="bold" fontSize="lg" mb="5">
        My Communities
      </Text>
      <View>
        {communities.length === 0 && <Text>No communities yet!</Text>}
        {communities.map((community, index) => (
          <CommunityCard
            key={index}
            {...community}
          />
        ))}
      </View>
    </Center>
  );
};

function DashboardPage({
  navigation, 
  route, 
  communityInfo, 
  actions, 
  completedList, 
  todoList,
  user
}) {
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const carbonSaved = completedList.length;

  return (
    <GestureHandlerRootView backgroundColor="white" flex="1">
      <ScrollView padding="5"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      >
        <VStack space={10} mb="20">
          <ProfileName navigation={navigation} communityInfo={communityInfo} userName={userName}/*userInfo={userInfo}*/ />
          <SustainScore CompletedList={completedList} />
          <CarbonSaved CompletedList={completedList} />

          {/* Todo and completed list */}
          <Text style={styles.category}>Todo list</Text>
          <ActionsList navigation={navigation} list={todoList} actions={actions} />
          <Text style={styles.category}>Completed Actions</Text>
          <ActionsList navigation={navigation} list={completedList} actions={actions} />

          {/* <BadgesList /> */}
          <TeamsList teams={user.teams} />
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
  },
});


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

export default connect(mapStateToProps)(DashboardPage);
