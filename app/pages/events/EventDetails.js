/******************************************************************************
 *                            EventDetails
 * 
 *      This page is responsible for rendering the community events's 
 *      information as a component called EventDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 2, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fetchAllCommunityData } from '../../config/redux/actions';
import { useDetails } from '../../utils/hooks';
import { formatDateString } from '../../utils/Utils';
import HTMLParser from '../../utils/HTMLParser';
import { FontAwesomeIcon } from '../../components/icons';
import { 
  ScrollView,
  VStack,
  Text,
  Divider,
  Box,
  Heading,
  Icon,
  AspectRatio,
  Image,
  Spinner,
  Center,
  View,
  HStack,
  Link,
  Pressable,
  Modal,
  Button,
} from '@gluestack-ui/themed-native-base';

const EventDetails = ({ route }) => {
  /*
   * Gets the id of the community through the parameters of the route;
   * Uses local state to determine whether the user has RSVPed or no;
   * Uses the useDisclosure function to determine if the user is going to
   * be able to RSVP the event.
   */
  const { event_id } = route.params;
  const [rsvp, setRsvp] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  /* 
   * Calls on the API again to display the information of that specific
   * event from that community using the useDetails function.
   */
  const [event, isEventLoading] = useDetails("events.info", { event_id });

  /* Marks the event as RSVPed if the user takes the action to do so */
  const handleAction = (action) => {
    setRsvp(action === rsvp ? "" : action);
    setModalOpen(false);
  };

  /* 
   * Function that handles adding the web protocol to the provided 
   * link from the API if it doesn't include one.
   */
  const addHttp = (url) => {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      return "http://" + url;
    }
    return url;
  };

  /* Displays a spinner while the information from is loading from the API */
  if (isEventLoading) {
    return (
      <Center width="100%" height="100%" bg="white">
        <Spinner />
      </Center>
    );
  }

  /* Displays the community event information */
  return (
    <View height="100%" py="5" style={{ backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false} mx="5">
        {/* Upper view with main event information */}
        <VStack space="2">
          {/* Event Image */}
          {event.image?.url && (
            <AspectRatio ratio={16 / 9}>
              <Image 
                source={{ uri: event.image.url }}
                alt="event's image"
                resizeMode="contain"
              />
            </AspectRatio>
          )}

          {/* Event's start and end date */}
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

          {/* Event's format: in-person, online, or hibrid (both) */}
          {['in-person', 'both'].includes(event.event_type) && (
            <VStack>
              <Text fontSize="lg" fontWeight="bold" color="primary.400">
                Venue
              </Text>
              <Text>
                {event.location ? `${event.location.city}, MA` : "N/A"}
              </Text>
            </VStack>
          )}
          {['online', 'both'].includes(event.event_type) && (
            <VStack>
              <Text
                mt={event.event_type === "both" ? 2 : 0}
                fontSize="lg"
                fontWeight="bold"
                color="primary.400"
              >
                Access Link
              </Text>
              {event.external_link_type === "Register" && (
                <Text fontWeight="300" mt={1}>
                  Register to access link
                </Text>
              )}
              {event.external_link !== "" && (
                <HStack space="2" alignItems="center">
                  <Icon
                    as={FontAwesomeIcon}
                    name="globe"
                    size="sm"
                    color="green.400"
                  />
                  <Link
                    _text={{ color: "primary.400" }}
                    href={addHttp(event.external_link)}
                  >
                    {event.external_link}
                  </Link>
                </HStack>
              )}
            </VStack>
          )}

          {/* RSVP event */}
          {event.rsvp_enabled && (
            <>
              <Pressable
                bg={rsvp === "" ? "secondary.400" : "muted.200"}
                p={2}
                mt={2}
                style={{
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => setModalOpen(true)}
              >
                <Text color="white" fontWeight="bold">
                  { rsvp !== "" ? rsvp : "RSVP for this event!"}
                </Text>
                <Text>{"  "}</Text>
                <Icon 
                  as={FontAwesomeIcon} 
                  name={isModalOpen ? "chevron-up" : "chevron-down"} 
                  color="white" 
                />
              </Pressable>
              
              {/* RSVP options (shouldn't appear if RSVP button isn't enabled) */}
              <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Content maxWidth="400px">
                  <Modal.CloseButton />
                  <Modal.Header>RSVP Options</Modal.Header>
                  <Modal.Body>
                    <Button
                      variant={rsvp === "Interested" ? "solid" : "outline"}
                      onPress={() => handleAction("Interested")}
                      mb={2}
                    >
                      Interested
                    </Button>
                    <Button
                      variant={rsvp === "Going" ? "solid" : "outline"}
                      onPress={() => handleAction("Going")}
                      mb={2}
                    >
                      Going
                    </Button>
                    <Button
                      variant={rsvp === "Not Going" ? "solid" : "outline"}
                      onPress={() => handleAction("Not Going")}
                    >
                      Not Going
                    </Button>
                  </Modal.Body>
                </Modal.Content>
              </Modal>
            </>
          )}
        </VStack>

        {/* Divisor between the upper view and the description of the event */}
        <Divider my="4" />

        {/* Event's name and description */}
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
