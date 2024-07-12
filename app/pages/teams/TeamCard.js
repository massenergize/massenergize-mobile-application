/******************************************************************************
 *                            TeamCard
 * 
 *      This page is responsible for rendering the community's teams 
 *      as a component called TeamCard. Through this component, it
 *      is possible to keep consistency across all teams and subteams
 *      pages.
 * 
 *      Written by: Moizes Almeida and Will Soylemez
 *      Last edited: July 12, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import {
  Heading,
  Text,
  VStack,
  Flex,
  Box,
  Pressable,
  Icon,
} from '@gluestack-ui/themed-native-base';
import { FontAwesomeIcon } from "../../components/icons";
import MEImage from "../../components/image/MEImage";


export default function TeamCard({
  navigation,
  team,
  isSubteam,
  ...props
}) {
  /* Displays the TeamCard of each team or sub-team of the community */
  return (
    <Pressable
      onPress={() =>
        navigation.navigate(isSubteam ? "SubteamDetails" : "TeamDetails", {
          team_id: team.team.id,
          team_stats: team,
          subteams: team.subteams ? team.subteams : [],
        })
      }
      backgroundColor="white"
      shadow={3}
      rounded="lg"
    >
      <Box
        overflow="hidden"
        {...props}
      >
        {/* Team's Logo */}
        <Box>
          <MEImage
            source={{ uri: team.team.logo?.url }}
            height={120}
            altComponent={<></>}
            alt="image"
            resizeMode="contain"
          />
        </Box>

        {/* Team information box */}
        <Box p="4">
          {/* Team's name and tagline */}
          <Box py="2">
            <Heading size="md">{team.team.name}</Heading>
            {team.team.tagline !== "" ? (
              <Text color="muted.400">{team.team.tagline}</Text>
            ) : null}
          </Box>

          {/* Team's stats */}
          <Box>
            <VStack space="2">
              {/* Team members */}
              <Flex direction="row">
                <Icon
                  as={FontAwesomeIcon}
                  name="user"
                  size="md"
                  color="blue.400"
                  mr="5"
                  textAlign="center"
                />
                <Text>
                  <Text fontWeight="bold">{team.members}</Text> Members
                </Text>
              </Flex>

              {/* Team's completed actions */}
              <Flex direction="row">
                <Icon
                  as={FontAwesomeIcon}
                  name="bolt"
                  size="md"
                  color="yellow.400"
                  mr="5"
                  textAlign="center"
                />
                <Text>
                  <Text fontWeight="bold">{team.actions_completed}</Text>{" "}
                  actions completed
                </Text>
              </Flex>

              {/* Team's carbon footprint reduction */}
              <Flex direction="row">
                <Icon
                  as={FontAwesomeIcon}
                  name="globe"
                  size="md"
                  color="green.400"
                  mr="5"
                  textAlign="center"
                />
                <Text>
                  <Text fontWeight="bold">
                    {(team.carbon_footprint_reduction / 133).toFixed(2)}
                  </Text>{" "}
                  Carbon Reduction Impact
                </Text>
              </Flex>
              
              {/* Team's sub-teams (if any) */}
              {isSubteam ? null : (
                <Flex direction="row">
                  <Icon
                    as={FontAwesomeIcon}
                    name="users"
                    size="md"
                    color="red.400"
                    mr="5"
                    textAlign="center"
                  />
                  <Text>
                    <Text fontWeight="bold">{team.subteams.length}</Text>{" "}
                    sub-teams
                  </Text>
                </Flex>
              )}
            </VStack>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}
