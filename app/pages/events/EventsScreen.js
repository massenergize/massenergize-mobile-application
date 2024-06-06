/******************************************************************************
 *                            EventsScreen
 * 
 *      This page is responsible for rendering the top tab of the 
 *      screens that display the Upcoming events, the Past events,
 *      and the Campaigns from a community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 31, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View } from 'react-native';
import React from 'react';
import TopTabsComponent from '../../components/tab/TopTabsComponent';
import Upcoming from './Upcoming';
import PastEvents from './PastEvents';
import Campaigns from './Campaigns';
import { connect } from 'react-redux';

const EventsScreen = ({navigation, events}) => {
  /* Creates the top tab that display the events screens */
  const tabs = [
    {
      name: 'Upcoming ',
      key: 'upcoming',
      component: <Upcoming navigation={navigation}/>,
    },
    {
      name: 'Past Events',
      key: 'past',
      component: <PastEvents navigation={navigation}/>,
    },
    {
      name: 'Campaigns',
      key: 'campaigns',
      component: <Campaigns />,
    },
  ];

  /* Displays the events screens */
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TopTabsComponent tabs={tabs} />
    </View>
  );
};

/* 
 * Transforms the local state of the app into the proprieties of the 
 * EventsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    actions: state.events,
  };
}

export default connect(mapStateToProps)(EventsScreen);
