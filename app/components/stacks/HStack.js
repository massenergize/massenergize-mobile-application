import {View, Text} from 'react-native';
import React from 'react';
import VStack from './VStack';

const HStack = props => {
  return (
    <VStack style={{...(props?.style || {}), flexDirection: 'row'}}>
      {props?.children}
    </VStack>
  );
};

export default HStack;
