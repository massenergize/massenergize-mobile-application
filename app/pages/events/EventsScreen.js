import {View, Text} from 'react-native';
import React from 'react';
import TopTabsComponent from '../../components/tab/TopTabsComponent';
import Upcoming from './Upcoming';
import PastEvents from './PastEvents';
import Campaigns from './Campaigns';

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

export default EventsScreen;
