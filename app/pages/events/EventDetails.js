/******************************************************************************
 *                            EventDetails
 * 
 *      This page is responsible for rendering the community events's 
 *      information as a component called EventDetails.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 30, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchAllCommunityData } from '../../config/redux/actions';
import { formatDateString } from '../../utils/Utils';

const EventDetails = () => {
  /* Displays the community event information */
  return (
    <View>
      <Text>EventDetails</Text>
	  </View>
  );
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