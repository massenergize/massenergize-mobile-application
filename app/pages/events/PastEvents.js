/******************************************************************************
 *                            PastEvents
 * 
 *      This page is responsible for rendering the past events 
 *      of each specific community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 3, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchAllCommunityData } from '../../config/redux/actions';
import { formatDateString } from '../../utils/Utils';
import EventCard from './EventCard';

const PastEvents = ({ navigation, events, communityInfo, fetchAllCommunityData }) => {
  /* 
   * Uses local state to determine whether it is loading the information from 
   * the API, as well as if there is any upcoming events and how many 
   */
  const [isLoading, setIsLoading] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);

  /* Fetch the information from the community */
  useEffect(() => {
    fetchAllCommunityData({ community_id: communityInfo.id });
  }, [fetchAllCommunityData, communityInfo.id]);

  /* 
   * Calculates how many past events and sets the state of loading to false
   */
  useEffect(() => {
    if (events) {
      const now = new Date();
      const past = events.filter(event => new Date(event.start_date_and_time) < now);
      setPastEvents(past);
      setIsLoading(false);
    }
  }, [events]);

  /* Displays the community's past events
   *
   * If the app is still loading the information, displays Activity Indicator
   * If there are no past events, displays message
   * If there are past events, display them as an Event Card
   */
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size={"large"} color="#DC4E34" style={styles.activity} />
      ) : (pastEvents.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No past events</Text>
        </View>
      ) : (
        <FlatList 
          data={pastEvents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ alignItems: "center", marginTop: 10 }}
          renderItem={({ item }) => (
            <EventCard
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
          )}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  activity: {
    alignSelf: 'center',
    marginTop: 300
  },
  noEventsContainer: {
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64B058'
  },
});

/* 
 * Transforms the local state of the app into the proprieties of the 
 * PastEvents function, in which it is got from the API.
 */
const mapStateToProps = (state) => ({
  communityInfo: state.communityInfo,
  events: state.events
});

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the PastEvents proprieties.
 */
const mapDispatchToProps = {
  fetchAllCommunityData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PastEvents);
