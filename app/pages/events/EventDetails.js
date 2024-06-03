/******************************************************************************
 *                            EventDetails
 * 
 *      This page is responsible for rendering the community events's 
 *      information as a component called EventDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 31, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { 
  Button,
  ScrollView,
  VStack,
  Text,
  Divider,
  Box,
  Heading,
  Icon,
  AspectRatio,
  Image,
  Actionsheet,
  useDisclose,
  Spinner,
  Center,
  View
} from '@gluestack-ui/themed-native-base';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '../../components/icons';
import HTMLParser from '../../utils/HTMLParser';
import { formatDateString } from '../../utils/Utils';
import { useDetails } from '../../utils/hooks';
import { connect } from 'react-redux';
import { fetchAllCommunityData } from '../../config/redux/actions';


const EventDetails = ({ route }) => {
  /*
   * * Gets the id of the community through the parameters of the route;
   * * Uses local state to determine whether the user has RSVPed or no;
   * * Uses the useDisclosure function to determine if the user is going to
   *      be able to RSVP the event.
   */
  const { event_id } = route.params;
  const [rsvp, setRsvp] = useState("");
  const { isOpen, onOpen, onClose } = useDisclose();

  /* Marks the event as RSVPed if the user takes the action to do so */
  const handleAction = (action) => {
    if (action === rsvp) {
      setRsvp("");
    } else {
      setRsvp(action);
    }
    onClose();
  };

  /* 
   * Calls on the API again to display the information of that specific
   * event from that community using the useDetails function.
   */
  const [event, isEventLoading] = useDetails("events.info", {
    event_id: event_id,
  });

  /* Displays the community event information */
  return (
    <View py="5">
      {isEventLoading
        ? 
        <Center width="100%" height="100%">
            <Spinner size="lg"/>
        </Center>
        : 
        <ScrollView showsVerticalScrollIndicator={false} mx="5">
          <VStack space="2">
            {/* Event Image */}
            {event.image?.url && (
              <AspectRatio ratio={16 / 9}>
                <Image 
                  source={{
                    uri: event.image?.url
                  }}
                  alt="event's image"
                  resizeMode="contain"
                />
              </AspectRatio>
            )}
            {/* Event Details */}
            <VStack>
              <Text fontSize="lg" fontWeight="bold" color="primary.400">
                Date
              </Text>
              <Text>
                {formatDateString(
                  new Date(event.start_date_and_time),
                  new Date(event.end_date_and_time)
                )}
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="lg" fontWeight="bold" color="primary.400">
                Venue
              </Text>
              <Text>
                {event.location
                  ? event.location.city + ", " + event.location.state
                  : "N/A"
                }
              </Text>
            </VStack>
            {/* TODO: What field has this? */}
            {/* <Text fontSize="lg" fontWeight="bold" color="primary.400">
              Every Wednedsay through 2023-08-31
            </Text> */}
            {event.rsvp_enabled && (
              <Button
                backgroundColor={
                  rsvp === "Going" ? "secondary.400" : "primary.600"
                }
                onPress={onOpen}
              >
                <Text color="white" fontWeight="bold">
                  {rsvp || "RSVP for this event!"}
                  {"  "}
                  {isOpen ? (
                    <Icon 
                      as={FontAwesomeIcon}
                      name="chevron-up"
                      color="white"
                    />
                  ) : (
                    <Icon 
                      as={FontAwesomeIcon}
                      name="chevron-down"
                      color="white"
                    />
                  )}
                </Text>
              </Button>
            )}
            {/* RSVP options (shouldn't appear if RSVP button isn't enabled) */}
            <Actionsheet isOpen={isOpen} onClose={onClose} on>
              <Actionsheet.Content>
                <Actionsheet.Item
                  backgroundColor={
                    rsvp === "Interested" ? "muted.200" : "white"
                  }
                  onPress={() => handleAction("Interested")}
                >
                  Interested
                </Actionsheet.Item>
                <Actionsheet.Item
                  backgroundColor={
                    rsvp === "Going" ? "muted.200" : "white"
                  }
                  onPress={() => handleAction("Going")}
                >
                  Going
                </Actionsheet.Item>
                <Actionsheet.Item
                  backgroundColor={
                    rsvp === "Not Going" ? "muted.200" : "white"
                  }
                  onPress={() => handleAction("Not Going")}
                >
                  Not Going
                </Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>
          </VStack>
          <Divider my="4" />
          <Box>
            <Heading textAlign="center">
              {event.name || "Event Name"}
            </Heading>
            {event.description && (
              <HTMLParser 
                htmlString={event.description}
                baseStyle={textStyle}
              />
            )}
          </Box>
        </ScrollView>
      }
    </View>
  );
};

const textStyle = {
  fontSize: "16px",
};

/* 
 * Transforms the local state of the app into the proprieties of the 
 * EventDetails function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
	communityInfo: state.communityInfo,
	events: state.events
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the EventDetails proprieties.
 */
const mapDispatchToProps = {
	fetchAllCommunityData,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);