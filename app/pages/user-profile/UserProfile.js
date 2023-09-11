import {View, Text} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';

const UserProfile = () => {
  return (
    <View style={{height: '100%', backgroundColor: COLOR_SCHEME.ORANGE}}>
      <Text>UserProfile</Text>
    </View>
  );
};

export default UserProfile;
