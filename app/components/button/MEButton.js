import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';
import {FontAwesomeIcon} from '../icons';

const MEButton = props => {
  const {children, containerStyle, style, asLink} = props;

  if (asLink) return <LinkButton {...props} />;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLOR_SCHEME.GREEN,
        padding: 13,
        marginVertical: 10,
        ...(containerStyle || {}),
      }}>
      <Text
        style={{
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          ...(style || {}),
        }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default MEButton;

const LinkButton = ({
  children,
  icon = 'long-arrow-right',
  iconStyle,
  style,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...(containerStyle || {}),
      }}>
      <Text
        style={{
          textDecorationStyle: 'solid',
          color: COLOR_SCHEME.GREEN,
          fontWeight: 'bold',
          ...(style || {}),
        }}>
        {children}
      </Text>
      {icon && (
        <FontAwesomeIcon
          name={icon}
          style={{
            color: COLOR_SCHEME.GREEN,
            marginLeft: 10,
            ...(iconStyle || {}),
          }}
        />
      )}
    </TouchableOpacity>
  );
};
