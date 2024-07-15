/******************************************************************************
 *                            EventDetails
 * 
 *      This page is responsible for rendering the community events's 
 *      information as a component called EventDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 15, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from 'react';
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
  Button,
  Modal,
} from '@gluestack-ui/themed-native-base';
import { PermissionsAndroid, Platform } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const EventDetails = ({ route }) => {
  /*
   * Gets the id of the community through the parameters of the route;
   */
  const { event_id } = route.params;

  /*
   * Uses local state to determine whether the user has added the event
   * to their calendar, and if they did then displays a Modal to alert
   * them that the event has been added to their calendar.
   */
  const [hasAdded, setHasAdded] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /* 
   * Calls on the API again to display the information of that specific
   * event from that community using the useDetails function.
   */
  const [event, isEventLoading] = useDetails("events.info", { event_id });

  /* 
   * Checked if the current platform is Android or no; in case it is, 
   * then ask for the user's permission to access their calendar so they 
   * can add events to their calendar. 
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCalendarPermission();
    }
  }, []);

  /* Function that asks the user for permission to access their calendar */
  const requestCalendarPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        {
          title: 'Calendar Permission',
          message: 'This app needs access to your calendar to add events.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the calendar');
      } else {
        console.log('Calendar permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  /* Function that adds an event to the user's calendar */
  const addEventToCalendar = () => {
    let notes = event.description ? 
                event.description.replace(/<\/?[^>]+(>|$)/g, "") : '';
  
    /* Adding access link to the notes if the event is online or both */
    if (['online', 'both'].includes(event.event_type) && event.external_link) {
      notes += `\nAccess Link: ${event.external_link}`;
    }
  
    /* Configuring the event object */
    const eventConfig = {
      title: event.name,
      startDate: new Date(event.start_date_and_time).toISOString(),
      endDate: new Date(event.end_date_and_time).toISOString(),
      location: ['in-person', 'both'].includes(event.event_type) && 
                event.location ? `${event.location.city}, MA` : undefined,
      url: ['online', 'both'].includes(event.event_type) && 
            event.external_link ? addHttp(event.external_link) : undefined,
      notes: notes,
      alarms: [{
        date: -60 * 60,
      }]
    };
  
    /* Presenting the event creating dialog */
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
    .then((eventInfo) => {
      /* 
       * If in the middle of the action the user's cancel the operation, 
       * then they still haven't added the event to their calendar.
       */
      if (eventInfo.action === "CANCELED") {
        setHasAdded(false);
        console.log("User has cancelled adding the event to calendar.")
      } else {
        console.log('Event added to calendar successfully: ', eventInfo);
        setHasAdded(true);
        setOpenModal(true);
      }
    })
    .catch((error) => {
      console.log('Error adding event to calendar: ', error);
    });
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

  /* Function that checks if the event is a Past Event */
  const isPastEvent = () => {
    const current = new Date();
    const eventDate = new Date(event.end_date_and_time);

    return current > eventDate;
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

          {/* 
            * If the event is not a Past Event, then present the user 
            * the feature to add event to their calendar 
            */}
          {
            !isPastEvent() && (
              <>
                {/* Add Event Button */}
                <Button
                  mt={2}
                  onPress={addEventToCalendar}
                  isDisabled={hasAdded}
                >
                  Add Event to Calendar
                </Button>
              </>
            )
          }
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

      {/* 
        * Modal for alerting user that the event has been added 
        * to their calendar.
        */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Content maxWidth={400}>
          <Modal.Body>
            <Center mb="5">
              <Icon
                as={FontAwesomeIcon}
                name="check-circle"
                size="lg"
                color="primary.600"
              />

              <Text
                fontSize="lg"
                bold
                py="5"
              >
                Event successfully added to your Calendar!
              </Text>
              <Text>
                You will be informed when the event is 
                happening 1 hour before.
              </Text>
            </Center>

            <Button
              colorScheme={"gray"}
              onPress={() => setOpenModal(false)}
            >
              Back
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
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
