import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';

const Loader = ({style, text, loaderStyle}) => {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(style || {}),
      }}>
      <ActivityIndicator
        style={loaderStyle || {}}
        size={32}
        color={COLOR_SCHEME.GREEN}
      />
      <Text style={{fontWeight: 'bold', color: COLOR_SCHEME.GREEN}}>
        {text || 'loading...'}
      </Text>
    </View>
  );
};

export default Loader;
