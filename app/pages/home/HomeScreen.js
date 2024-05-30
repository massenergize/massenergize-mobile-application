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

const Home = ({}) => {
  return (
    <View>
      {/* <Text>This is meant to be the home page</Text>  */}
      <TabNavigator tabs={TABS} initialRoute="Events" />
    </View>
  );
};

const mapStateToProps = state => {
  return {test: state.test};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
