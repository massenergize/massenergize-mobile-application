import {View, Text} from 'react-native';
import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AboutUsScreen from '../../pages/about/AboutUsScreen';

const TABS = {
  community: {
    name: 'community',
    icon: 'home',
    key: 'community',
    component: AboutUsScreen,
  },
  actions: {
    name: 'Actions',
    icon: 'flash',
    key: 'actions',
    component: AboutUsScreen,
  },
  events: {
    name: 'Events',
    icon: 'calendar',
    key: 'events',
    component: AboutUsScreen,
  },
  profile: {
    name: 'profile',
    icon: 'person-circle',
    key: 'community',
    component: AboutUsScreen,
  },
};
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <View style={{height: '100%', backgroundColor: 'red'}}>
      <View></View>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let tab = TABS[route.name];
            return <Ionicons name={tab?.icon} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#64B058',
          tabBarInactiveTintColor: '#B3B2BD',
          tabBarLabel: TABS[route.name]?.name,
          headerShown: false,
        })}>
        {Object.entries(TABS).map(([key, value]) => {
          return (
            <Tab.Screen
              key={key}
              name={value?.name}
              component={value?.component}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
