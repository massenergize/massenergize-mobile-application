/******************************************************************************
 *                            TabNavigator
 * 
 *      This file contains a component that can be used to create a tab,
 *      allowing the user to navigate between different screens.
 * 
 *      Written by: Frimpong Opoku-Agyemang and William Soylemez
 *      Last edited: 2024
 * 
 * *****************************************************************************/

import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {FontAwesomeIcon, IonicIcon} from '../icons';
import {COLOR_SCHEME} from '../../stylesheet';


const CustomTabBar = ({state, descriptors, navigation, tabs}) => {
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

        let tab = tabs[route.name];
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

const TabNavigator = ({tabs, initialRoute}) => {
  const Tab = createBottomTabNavigator();

  return (
    <View style={{height: '100%', backgroundColor: 'red'}}>
      <Tab.Navigator
        // tabBarOptions={{
        //   showLabel: false,
        //   style: {backgroundColor: 'white'},
        // }}
        initialRouteName={initialRoute || Object.values(tabs)[0]?.name}
        tabBar={props => <CustomTabBar {...props} tabs={tabs} />}
        screenOptions={({}) => ({
          tabBarShowLabel: false,
          tabBarStyle: [{backgroundColor: 'white'}, null],
          headerShown: false,
        })}>
        {Object.entries(tabs).map(([key, value]) => {
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
