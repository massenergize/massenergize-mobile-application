import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AboutUsScreen from '../../pages/about/AboutUsScreen';
import {FontAwesomeIcon, IonicIcon} from '../icons';
import {COLOR_SCHEME} from '../../stylesheet';
import EventsScreen from '../../pages/events/EventsScreen';
import CommunityHomeScreen from '../../pages/home/CommunityHomeScreen';
import ActionsScreen from '../../pages/actions/ActionsScreen';
import TeamsScreen from '../../pages/teams/TeamsScreen';

// TODO: When there is time, lets make this a component that can accept any dynamic list of tab items
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

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: COLOR_SCHEME.LIGHT_GREY,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const tintColor = isFocused ? COLOR_SCHEME.GREEN : 'grey';

        let tab = TABS[route.name];
        const icon = tab?.icon;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={{flex: 1, alignItems: 'center', padding: 16}}>
            <FontAwesomeIcon name={icon} size={22} color={tintColor} />
            <Text
              style={{
                color: tintColor,
                fontSize: 10,
                marginTop: 5,
                fontWeight: isFocused ? 'bold' : '400',
              }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <View style={{height: '100%', backgroundColor: 'red'}}>
      <Tab.Navigator
        // tabBarOptions={{
        //   showLabel: false,
        //   style: {backgroundColor: 'white'},
        // }}
        initialRouteName="Events"
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={({}) => ({
          tabBarShowLabel: false,
          tabBarStyle: [{backgroundColor: 'white'}, null],
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
