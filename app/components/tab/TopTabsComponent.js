import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {COLOR_SCHEME} from '../../stylesheet';

const TopTabsComponent = ({tabs = [], defaultTab}) => {
  const [activeTab, setActiveTab] = useState();
  useEffect(() => {
    setActiveTab(defaultTab || tabs[0]?.key);
  }, [defaultTab]);

  const renderTabs = () => {
    const tabWidth = 100 / tabs?.length || 1;
    return tabs.map(tab => {
      const isActive = activeTab === tab.key;

      const common = {
        cont: {},
        text: {textTransform: 'uppercase'},
      };
      const activeStyle = {
        cont: {
          backgroundColor: COLOR_SCHEME.GREEN,
          borderColor: COLOR_SCHEME.GREEN,
          borderWidth: 0,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 13,
          ...common.text,
        },
      };
      const notActive = {
        cont: {
          borderBottomWidth: 1,
          borderTopWidth: 0,
          borderColor: COLOR_SCHEME.GREEN,
        },
        text: {
          fontSize: 12,
          color: 'black',
          ...common.text,
        },
      };

      const theme = isActive ? activeStyle : notActive;

      return (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={{
            width: tabWidth + '%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderBottomWidth: isActive ? 2 : 0,

            ...theme.cont,
          }}>
          <Text style={theme.text}>{tab.name}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          // justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          // paddingRight: 70,
          // paddingHorizontal: 10,
          // paddingVertical: 5,
        }}>
        {renderTabs()}
      </ScrollView>

      <View>
        {tabs?.map(tab => (
          <View
            key={tab?.key}
            style={{
              display: activeTab === tab?.key ? 'flex' : 'none',
            }}>
            {tab?.component}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopTabsComponent;
