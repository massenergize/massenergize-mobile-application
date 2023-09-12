import {View, Text} from 'react-native';
import React, { useEffect } from 'react';
import VStack from '../../components/stacks/VStack';
import Loader from '../../components/loaders/Loader';
import MEButton from '../../components/button/MEButton';

const LoadingScreen = ({route}) => {
  const {community_id} = route?.params || {};

  useEffect(() => { 
    
  },[])


  return (
    <VStack center style={{height: '100%'}}>
      <Loader text="Almost there..." />
    </VStack>
  );
};

export default LoadingScreen;
