/******************************************************************************
 *                            EventsScreen
 * 
 *      This page is responsible for rendering the top tab of the 
 *      screens that display the Upcoming events, the Past events,
 *      and the Campaigns from a community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 17, 2024
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
import MEInfoModal from "../../components/modal/MEInfoModal";
import FilterSelector from "../../components/filter/FilterSelector";

const EventsScreen = ({ navigation, events, fireAuth, toggleModal }) => {
  /*
   * Uses local state to determine whether the information about the events
   * is loading, and depending on the id of the filter (upcoming, past or
   * campaign), it loads the 'newEvents' with the array of events information.
   */
  const [newEvents, setNewEvents] = useState(events);
  const [filter, setFilter] = useState({ Time: 'All', Type: 'All' });

  /* 
   * Filters the events depending on if it is an upcoming event, 
   * past event or campaign, and loads all the information about each 
   * event in the 'newEvents'.
   */
  const applyFilter = (newFilter) => {
    setFilter(newFilter);

    const filteredEvents = events.filter((event) => {

      if (newFilter.Type !== 'All' && event.event_type !== newFilter.Type) {
        return false;
      }

      if (newFilter.Time === 'Upcoming') {
        return new Date(event.start_date_and_time) >= new Date();
      } else if (newFilter.Time === 'Past') {
        return new Date(event.start_date_and_time) < new Date();
      } else {
        return true;
      }
    });

    setNewEvents(filteredEvents);
  }


  /* Generates the top tab of events for Upcoming, Past, or Campaigns */
  const renderHeader = () => {
    return (
      <>
        <HStack alignItems="center" justifyContent="center">
          <Text fontSize={30} bold p={5}>
            Events
          </Text>
          <MEInfoModal>
            <Text
              bold
              color="primary.400"
              fontSize="lg"
            >
              Events
            </Text>
            <Text>
              This page displays all the events that are happening in your community.{"\n"}
              You can create an event by clicking the "Add Event" button.
            </Text>

          </MEInfoModal>
        </HStack>
        <FilterSelector filter={filter} handleChangeFilter={applyFilter}>
          <FilterSelector.Filter name="Time">
            <FilterSelector.Option value="All"/>
            <FilterSelector.Option value="Upcoming"/>
            <FilterSelector.Option value="Past"/>
          </FilterSelector.Filter>
          <FilterSelector.Filter name="Type">
            <FilterSelector.Option value="All"/>
            <FilterSelector.Option label="In-Person" value="in-person"/>
            <FilterSelector.Option label="Online" value="online"/>
          </FilterSelector.Filter>
        </FilterSelector>
      </>
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
    <View bg="white" height="100%" alignItems="center">
      <ScrollView>
        {
          renderHeader()
        }
        {
          renderAddEvent()
        }
        {newEvents.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 200
            }}
          >
            <Text fontSize="xs"
              textAlign="center"
              px={10}
              color="gray.400"
            >
              No events so far...{"\n"}You can create one!
            </Text>
          </View>
        ) : (
          newEvents.map((item) => (
            <EventCard
              data={item}
              navigation={navigation}
              my="3"
              mx={2}
              shadow={3}
              key={item.id}
            />
          ))
        )}
      </ScrollView>
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
