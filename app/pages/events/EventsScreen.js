/******************************************************************************
 *                            EventsScreen
 * 
 *      This page is responsible for rendering the top tab of the 
 *      screens that display the Upcoming events, the Past events,
 *      and the Campaigns from a community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 11, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState, useEffect } from "react";
import {
    Button,
    Center,
    HStack,
    Spinner,
    View,
    ScrollView,
    Text,
} from '@gluestack-ui/themed-native-base';
import { StyleSheet } from "react-native";
import EventCard from "./EventCard";
import { formatDateString } from "../../utils/Utils";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { toggleUniversalModalAction } from "../../config/redux/actions";
import AuthOptions from "../auth/AuthOptions";

const EventsScreen = ({ navigation, events, fireAuth, toggleModal }) => {
    /*
     * Uses local state to determine whether the information about the events
     * is loading, and depending on the id of the filter (upcoming, past or
     * campaign), it loads the 'newEvents' with the array of events information.
     */
    const [isLoading, setIsLoading] = useState(true);
    const [newEvents, setNewEvents] = useState([]);
    const [eventFilterID, setEventFilterID] = useState(0);
    
    /* 
     * Filters the events depending on if it is an upcoming event, 
     * past event or campaign, and loads all the information about each 
     * event in the 'newEvents'.
     */
    useEffect(() => {
        const filterEvents = () => {
            let filteredEvents = [];
            const now = new Date();

            if (eventFilterID === 0) {
                /* Upcoming events */
                filteredEvents = events.filter(
                  (event) => new Date(event.start_date_and_time) > now
                );
            } else if (eventFilterID === 1) {
                /* Past Events */
                filteredEvents = events.filter(
                  (event) => new Date(event.start_date_and_time) < now
                );
            } else {
                /* TODO: campaigns */
                filteredEvents = [];
            }

            setNewEvents(filteredEvents);
            setIsLoading(false);
        };

        setIsLoading(true);
        filterEvents();
    }, [events, eventFilterID]);

    /* Generates the Tab button component for each tab in the Details page */
    function TabButton({ label, id }) {
      return (
        <Button
          variant={eventFilterID === id ? "solid" : "outline"}
          _text={{ fontSize: 'xs' }}
          borderRadius="full"
          onPress={() => setEventFilterID(id)}
        >
          {label + " Events"}
        </Button>
      );
    }

    /* Generates the top tab of events for Upcoming, Past, or Campaigns */
    const renderHeader = () => {
        return (
            <HStack 
              style={{ marginTop: 10 }}
              width="100%" 
              justifyContent="center" 
              space={1} 
              mb={1}
            >
                <TabButton label="Upcoming" id={0} />
                <TabButton label="Past" id={1} />

                <Button
                    variant="outline"
                    _text={{ fontSize: 'xs' }}
                    borderRadius="full"
                    onPress={() => setEventFilterID(2)}
                    isDisabled
                >
                    Campaigns
                </Button>
            </HStack>
        );
    };

    /* Renders the Add Event button */
    const renderAddEvent = () => {
      return (
        <Button
          title="Add Event"
          onPress={() => {
            if (fireAuth) navigation.navigate("AddEvent");
            else {
              toggleModal({
                isVisible: true,
                Component: AuthOptions,
                title: 'How would you like to sign in or Join?',
              });
            }
          }}
          m={5}
          px={10}
        >
          Add Event
        </Button>
      );
    }

    /* Displays the information for all events and campaigns */
    return (
        <View>
            { isLoading ? (
                <Center flex="1">
                    <Spinner />
                </Center>
            ) : (
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    {
                      renderHeader()
                    }
                    {
                      renderAddEvent()
                    }
                    { newEvents.length === 0 ? (
                      <View 
                        style={{ 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          marginTop: 300 
                        }}
                      >
                          <Text style={styles.noEventsText}>
                            No upcoming events
                          </Text>
                      </View>
                    ) : (
                        newEvents.map((item) => (
                            <EventCard
                                key={item.id}
                                title={item.name}
                                date={formatDateString(
                                    new Date(item.start_date_and_time),
                                    new Date(item.end_date_and_time)
                                )}
                                location={item.location}
                                imgUrl={item.image?.url}
                                canRSVP={item.rsvp_enabled}
                                id={item.id}
                                navigation={navigation}
                                my="3"
                                mx={2}
                                shadow={3}
                            />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  noEventsText: {
    fontSize: 18,
    color: '#DC4E34',
  },
});

/* 
 * Transforms the local state of the app into the proprieties of the 
 * EventsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    events: state.events,
    fireAuth: state.fireAuth,
  }
}
/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the EventsScreen proprieties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleModal: toggleUniversalModalAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsScreen);
