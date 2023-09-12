import {View, Text} from 'react-native';
import React from 'react';

const VStack = ({style, children, center}) => {
  const centerStyle = {alignItems: 'center', justifyContent: 'center'};
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...(center ? centerStyle : {}),
        ...(style || {}),
      }}>
      {children}
    </View>
  );
};

export default VStack;
