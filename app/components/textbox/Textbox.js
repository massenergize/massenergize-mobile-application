import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';

const Textbox = ({
  label = 'Enter your email',
  style,
  labelStyle,
  placholder,
  generics,
}) => {
  return (
    <View style={{width: '100%', marginVertical: 6}}>
      {label && (
        <Text style={{fontWeight: 'bold', ...(labelStyle || {})}}>{label}</Text>
      )}
      <TextInput
        style={{
          width: '100%',
          borderWidth: 2,
          borderColor: 'grey',
          paddingVertical: 12,
          paddingHorizontal: 20,
          marginVertical: 6,
          ...(style || {}),
        }}
        {...(generics || {})}
        placeholder={placholder}
      />
    </View>
  );
};

export default Textbox;
