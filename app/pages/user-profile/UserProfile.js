import {View, Text} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';
import {connect} from 'react-redux';
import VStack from '../../components/stacks/VStack';

const UserProfile = ({user}) => {
  const {preferred_name} = user || {};
  return (
    <VStack
      center
      style={{height: '100%', backgroundColor: COLOR_SCHEME.ORANGE}}>
      <Text style={{fontWeight: 'bold', fontSize: 22, color: 'white'}}>
        {preferred_name
          ? `Welcome ${preferred_name}!`
          : 'Welcome, try signing in...!'}
      </Text>
    </VStack>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(UserProfile);
