/******************************************************************************
 *                            EventCard
 * 
 *      This page is responsible for rendering the community events 
 *      as a component called EventCard. Through this component, it
 *      is possible to keep consistency across all events pages.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 3, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import {
    Box,
    Pressable,
    AspectRatio,
    Image,
    Text,
    Icon,
    Flex,
    Center,
    Button,
} from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import events from "../../stylesheet/events";


export default EventCard = React.memo(
    ({
        title, 
        date,
        location,
        imgUrl,
        id,
        navigation,
        ...props
    })  => {
    
    /* Displays the community's events as a EventCard */
    return (
        <Pressable
            onPress={() => navigation.navigate('EventDetails', { event_id: id })}
            backgroundColor="white"
            width={events.cardWidth}
            rounded="lg"
            {...props}
        >
            <Box rounded="lg" flex={1} overflow="hidden">
                {/* Image */}
                <Flex>
                    {imgUrl ? (
                        <AspectRatio width="100%" ratio={16 / 9}>
                            <Image 
                                source={{ uri: imgUrl }}
                                alt="event's image"
                                resizeMode="cover"
                            />
                        </AspectRatio>
                    ) : (
                        <Box height={200} bg="gray.300"></Box>
                    )}
                </Flex>

                {/* Title */}
                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    flexGrow="1"
                    px="4"
                    pt="4"
                    pb="2"
                >
                    <Text fontWeight="bold" fontSize="md" w="90%" mr="3">
                            {title}
                    </Text>
                    <Icon 
                        as={FontAwesome}
                        name="arrow-right"
                        size="md"
                        color="primary.400"
                    />
                </Flex>

                {/* Meta */}
                <Flex
                    backgroundColor="gray.100"
                    flexDirection="row" 
                    flexWrap="wrap"
                    justifyContent="space-between"
                    py={2}
                >
                    <Box px="4" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text fontSize={events.cardMetaFontSize} color="primary.400">
                                {date}
                            </Text>
                    </Box>
                </Flex>
            </Box>
        </Pressable>
    );
});