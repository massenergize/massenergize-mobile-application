/******************************************************************************
 *                            EventCard
 * 
 *      This page is responsible for rendering the community events 
 *      as a component called EventCard. Through this component, it
 *      is possible to keep consistency across all events pages.
 * 
 *      Written by: Moizes Almeida and William Soylemez
 *      Last edited: July 25, 2024
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
  Badge,
} from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import events from "../../stylesheet/events";
import Moment from "moment";


export default EventCard = React.memo(
  ({
    data,
    navigation,
    ...props
  }) => {

    /* Displays the community's events as a EventCard */
    return (
      <Pressable
        onPress={() => navigation.navigate('EventDetails', { event_id: data.id })}
        backgroundColor="white"
        width={events.cardWidth}
        rounded="lg"
        {...props}
      >
        <Box rounded="lg" flex={1} overflow="hidden">
          {/* Pending Approval Banner */}
          {
            !data.is_approved &&
            <Badge
              colorScheme="red"
              position="absolute"
              top={2}
              right={2}
              zIndex={1}
              style={{
                backgroundColor: '#DC4E34',
                color: 'white',
              }}
              _text={{
                color: "white"
              }}
            >
              Pending Approval
            </Badge>
          }
          {/* Image */}
          <Flex>
            {data?.image?.url ? (
              <AspectRatio width="100%" ratio={16 / 9}>
                <Image
                  source={{ uri: data?.image?.url }}
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
              {data.name}
            </Text>
            <Icon
              as={FontAwesome}
              name="arrow-right"
              size="md"
              color="primary.400"
            />
          </Flex>

          <Flex
            flexDirection="row"
            justifyContent="space-between"
            flexGrow="1"
            px="4"
            pb="1"
          >
            <Text 
              fontWeight="300" 
              color="gray.600" 
              fontSize="sm" 
              w="90%" 
              mr="3"
            >
              {
                data.event_type === "in-person"
                  ? "In-Person"
                  : data.event_type === "online"
                      ? "Online"
                      : "In-Person & Online"
              }
            </Text>
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
                {Moment(data.start_date_and_time).format('ll')}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Pressable>
    );
  });