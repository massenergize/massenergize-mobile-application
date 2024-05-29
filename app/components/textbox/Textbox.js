import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';

const Textbox = ({
  label = 'Enter your email',
  onChange,
  style,
  labelStyle,
  placeholder,
  generics,
  value,
  defaultValue,
}) => {
  const _value = value || defaultValue || '';
  return (
    <View style={{width: '100%', marginVertical: 6}}>
      {label && (
        <Text style={{fontWeight: 'bold', ...(labelStyle || {})}}>{label}</Text>
      )}
      <TextInput
        onChangeText={text => onChange && onChange(text)}
        style={{
          width: '100%',
          borderWidth: 2,
          borderColor: 'grey',
          paddingVertical: 12,
          paddingHorizontal: 20,
          marginVertical: 6,
          ...(style || {}),
        }}
        value={_value}
        {...(generics || {})}
        placeholder={placeholder}
      />
    </View>
  );
};

export default Textbox;
