/******************************************************************************
 *                            TeamCard
 * 
 *      This page is responsible for rendering the community's teams 
 *      as a component called TeamCard. Through this component, it
 *      is possible to keep consistency across all teams and subteams
 *      pages.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 4, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import {
    Heading,
    Text,
    VStack,
    Image,
    Flex,
    Box,
    Pressable,
    AspectRatio,
    Icon,
} from 'native-base';
import { FontAwesomeIcon } from "../../components/icons";

/* Component that displays the logo of the team or sub-team */
const Logo = ({ url }) => {
    return (
        <AspectRatio ratio={16 / 9} width="100%">
            <Image
                source={{ uri: url}}
                alt="image"
                resizeMode="contain"
            />
        </AspectRatio>
    );
};


export default function TeamCard({
    navigation,
    team,
    isSubteam,
    ...props
}) {
    /* Displays the TeamCard of each team or sub-team of the community */
    return (
        <Flex
            direction="column"
            rounded="lg"
            shadow="3"
            backgroundColor="white"
            overflow="hidden"
            {...props}
        >
            <Pressable
                onPress={() =>
                    navigation.navigate( isSubteam ? "SubteamDetails" : "TeamDetails", {
                        team_id: team.team.id,
                        team_stats: team,
                        subteams: team.subteams ? team.subteams : [],
                    })
                }
            >
                <Box>
                    {team.team.logo ? <Logo url={team.team.logo.url} /> : null}
                </Box>
                <Box p="4">
                    <Box py="2">
                        <Heading size="md">{team.team.name}</Heading>
                        {team.team.tagline !== "" ? (
                            <Text color="muted.400">{team.team.tagline}</Text>
                        ) : null}
                    </Box>
                    <Box>
                        <VStack space="2">
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
                                    Trees
                                </Text>
                            </Flex>
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
            </Pressable>
        </Flex>
    );
}