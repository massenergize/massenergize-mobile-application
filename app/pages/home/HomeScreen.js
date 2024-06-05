/******************************************************************************
 *                            HomeScreen
 * 
 *      This page is responsible for rendering the bottom tabs
 *      that display the Community Home screen, the Actions
 *      screen, the Events screens, and the Teams screen. The
 *      Community Home screen is the default (first) screen.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: June 5, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import {View, Text} from 'react-native';
import React from 'react';
import TabNavigator from '../../components/tab/TabNavigator';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import EventsScreen from '../../pages/events/EventsScreen';
import CommunityHomeScreen from '../../pages/home/CommunityHomeScreen';
import ActionsScreen from '../../pages/actions/ActionsScreen';
import TeamsScreen from '../../pages/teams/TeamsScreen';
import AboutUsScreen from '../../pages/about/AboutUsScreen';

/* Defines the bottom tabs of the app */
const TABS = {
  Home: {
    name: 'Home',
    icon: 'home',
    key: 'home',
    component: CommunityHomeScreen,
  },
  Actions: {
    name: 'Actions',
    icon: 'flash',
    key: 'actions',
    component: ActionsScreen,
  },
  Events: {
    name: 'Events',
    icon: 'calendar',
    key: 'events',
    component: EventsScreen,
  },
  Teams: {
    name: 'Teams',
    icon: 'users',
    key: 'teams',
    component: TeamsScreen,
  },
};

const Home = ({ navigation }) => {
  /* Displays the app's Home screen */
  return (
    <View>
      <TabNavigator tabs={TABS} initialRoute="Home" />
    </View>
  );
};

/* 
 * Transforms the local state of the app into the proprieties of the 
 * HomeScreen function, in which it is got from the API.
 */
const mapStateToProps = state => {
  return {test: state.test};
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the HomeScreen properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
