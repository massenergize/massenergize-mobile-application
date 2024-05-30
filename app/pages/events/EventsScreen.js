import {View, Text} from 'react-native';
import React from 'react';
import TopTabsComponent from '../../components/tab/TopTabsComponent';
import Upcoming from './Upcoming';
import PastEvents from './PastEvents';
import Campaigns from './Campaigns';
import { connect } from 'react-redux';

const EventsScreen = () => {
  const tabs = [
    {
      name: 'Upcoming ',
      key: 'upcoming',
      component: <Upcoming />,
    },
    {
      name: 'Past Events',
      key: 'past',
      component: <PastEvents />,
    },
    {
      name: 'Campaigns',
      key: 'campaigns',
      component: <Campaigns />,
    },
  ];
  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <TopTabsComponent tabs={tabs} />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    actions: state.events,
  };
}

export default connect(mapStateToProps)(EventsScreen);

// export default EventsScreen;
