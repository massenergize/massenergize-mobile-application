/******************************************************************************
 *                            EventDetails
 * 
 *      This page is responsible for rendering the community events's 
 *      information as a component called EventDetails.
 * 
 *      Written by: Moizes Almeida and Will Soylemez
 *      Last edited: July 25, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDetails } from '../../utils/hooks';
import { formatDateString } from '../../utils/Utils';
import HTMLParser from '../../utils/HTMLParser';
import { FontAwesomeIcon, IonicIcon } from '../../components/icons';
import Share from 'react-native-share';
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
  Badge,
  Spacer,
} from '@gluestack-ui/themed-native-base';
import {
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Linking,
  Pressable
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { Icon as SocialIcons } from 'react-native-elements';
import { COLOR_SCHEME } from '../../stylesheet';
import { useNavigation } from '@react-navigation/native';

const EventDetails = ({ route, navigation }) => {
  /*
   * Gets the id of the community through the parameters of the route;
   */
  const { event_id } = route.params;

  /*
   * Uses local state to determine whether the user has added the event
   * to their calendar, and if they did then displays a Modal to alert
   * them that the event has been added to their calendar. Also, if the
   * event is shared between communities, use local state to determine
   * if the user has clicked in the Shared Event modal.
   */
  const [hasAdded, setHasAdded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSharedModal, setOpenSharedModal] = useState(false);

  /* 
   * Calls on the API again to display the information of that specific
   * event from that community using the useDetails function.
   */
  const [event, isEventLoading] = useDetails("events.info", { event_id });
  console.log(JSON.stringify(event, null, 2));

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

  /* 
   * Function that renders the Social Icon button that allows the user 
   * to share the event.
   */
  const SocialIcon = ({ name, onPress }) => {
    /* Configuration of styling for the button */
    let iconName, colorName;

    if (name === 'facebook') {
      iconName = 'facebook';
      colorName = '#3b5998';
    } else if (name === 'linkedin') {
      iconName = 'linkedin';
      colorName = '#0a66c2';
    } else if (name === 'email') {
      iconName = 'envelope';
      colorName = '#004f9f';
    }

    /* Calls on the onPress function passed as a parameter for this function */
    const handlePress = () => {
      onPress();
    };

    /* Displays the Social Icon button */
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          marginHorizontal: 15,
          paddingBottom: 20,
        }}
      >
        <SocialIcons
          name={iconName}
          type='font-awesome'
          color={colorName}
          size={30}
        />
      </TouchableOpacity>
    );
  };

  /* 
   * Function that handles displaying the Social Icon buttons for the user
   * to share about the event with others.
   */
  const shareEventButtons = () => {
    /* Creates an array with all the options of sharing for the user */
    const socialIcons = [
      { name: 'facebook', onPress: () => shareEvent('facebook') },
      { name: 'linkedin', onPress: () => shareEvent('linkedin') },
      { name: 'email', onPress: () => shareEvent('email') },
    ];

    /* Renders the Social Icons */
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        {socialIcons.map((icon, index) => (
          <SocialIcon
            key={index}
            name={icon.name}
            onPress={icon.onPress}
          />
        ))}
      </View>
    );
  };

  /* Function that handles the action of pressing in one of the Social Icons */
  const shareEvent = async (platform) => {
    /* 
     * Creates the share option for the user, including a title, message, 
     * description, and url.
     */
    const shareOptions = {
      title: 'Share Event',
      message: `Check out this event: ${event.name}\n\nDate: ${formatDateString(
        new Date(event.start_date_and_time),
        new Date(event.end_date_and_time)
      )}\n\nDescription: ${event.description
        ? event.description.replace(/<\/?[^>]+(>|$)/g, "")
        : ''}\n\nLink: ${addHttp(event.external_link)}`,
      url: `https://community.massenergize.org/${event.community.subdomain}/events/${event_id}`,
      failOnCancel: false,
    };

    /* Share on social media or email or copy to clipboard */
    try {
      if (platform === 'facebook') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.FACEBOOK,
        });
      } else if (platform === 'linkedin') {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareOptions.url)}`;
        Linking.openURL(linkedInUrl);
      } else if (platform === 'email') {
        await Share.open({
          ...shareOptions,
          social: Share.Social.EMAIL,
          email: '',
        });
      }
    } catch (error) {
      console.log('Error sharing event: ', error);
    }
  };

  const editEvent = () => {
    navigation.navigate('AddEvent', {
      event: event,
      editMode: true
    });
  }

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

          {/* Event's format: in-person, online, or hybrid (both) */}
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
                mt={event.event_type === "both" ? 1 : 0}
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
        <Box pt={5}>
          {/* Pending Approval Badge */}
          {event.is_approved === false && (
            <Badge
              colorScheme="red"
              position="absolute"
              top={-4}
              right={2}
              zIndex={1}
              style={{
                backgroundColor: "#DC4E34",
                color: 'white'
              }}
              _text={{
                color: "white"
              }}
            >
              Pending Approval
            </Badge>
          )}
          
          {/* Shared Event Badge */}
          {event.shared_to?.length !== 0 && (
            <>
              <Pressable
                mx={3}
                position="absolute"
                top={-4}
                left={2}
                zIndex={1}
                style={{
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: '#EC763F',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {setOpenSharedModal(true)}}
              >
                <Text
                  color="#EC763F"
                  bold
                  fontSize="sm"
                >
                  SHARED
                </Text>
              </Pressable>
              <Spacer my="1.5"/>
            </>
          )}

          <Heading textAlign="center">
            {event.name || "Event Name"}
          </Heading>

          {event.description && (
            <HTMLParser
              htmlString={event.description}
              baseStyle={textStyle}
            />
          )}

          {/* 
            * If the event is not past and approved then display the
            * option to share that event with other people.
            */}
          {
            !isPastEvent() && event.is_approved && <>
              <Divider my="4" />

              <Text
                fontSize="xs"
                textAlign="center"
                px={10}
                pb={3}
                color="gray.400"
              >
                Share this Event!
              </Text>

              {shareEventButtons()}
            </>
          }
          {/* For pending events */}
          {
            event.is_approved === false && (
              <View
                width="100%"
                style={{
                  marginTop: 40
                }}
              >
                {/* 
                  * Divisor between the description of the event 
                  * and the edit button.
                  */}
                <Divider my="4" />

                <Pressable
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                  onPress={editEvent}
                >
                  <IonicIcon
                    name="pencil"
                    size={20}
                    color={COLOR_SCHEME.GREEN}
                  />
                  <Text
                    color={COLOR_SCHEME.GREEN}
                    ml={2}
                    bold
                  >
                    Edit Event
                  </Text>
                </Pressable>

              </View>
            )
          }
        </Box>
      </ScrollView>
      
      {/* Shared Event Modal */}
      <Modal
        onClose={() => setOpenSharedModal(false)}
        isOpen={openSharedModal}
        animationType="slide"
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center' 
          }}
        >
          <View 
            style={{ 
              width: 300, 
              alignSelf: 'center',
            }}
          >
            <Modal.Content
              style={{ width: 300 }} 
              alignSelf="center"
            >
              {/* Close Button */}
              <Modal.CloseButton/>

              {/* Modal Body */}
              <Modal.Body>
                {/* Header */}
                <Text
                  bold
                  color="primary.400"
                  fontSize="lg"
                  mb={1}
                >
                  This is a Shared Event with other Communities
                </Text>

                {/* Body */}
                <Text mb={2}>
                  The communities partnering with this event are:
                </Text>
                
                {/* Display community that created the event */}
                <Text
                  color="gray.600"
                  fontWeight="600"
                >
                  - {event.community.name} (Creator)
                </Text>

                {/* List of partnering communties */}
                {
                  event.shared_to?.map((community, index) => (
                    <Text
                      key={index}
                      color="gray.600"
                      fontWeight="300"
                    >
                      - {community.name}
                    </Text>
                  ))
                }
              </Modal.Body>
            </Modal.Content>
          </View>
        </ScrollView>
      </Modal>

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

export default connect(mapStateToProps)(EventDetails);