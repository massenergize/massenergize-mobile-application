import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';
import {FontAwesomeIcon} from '../icons';

const MEButton = props => {
  const {children, containerStyle, style, asLink, onPress} = props;

  if (asLink) return <LinkButton {...props} />;

  return (
    <TouchableOpacity
      onPress={onPress}
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
  icon,
  iconStyle,
  style,
  containerStyle,
  noArrow = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...(containerStyle || {}),
      }}>
      {icon && (
        <FontAwesomeIcon
          name={icon}
          style={{
            color: COLOR_SCHEME.GREEN,
            marginRight: 10,
            ...(iconStyle || {}),
          }}
        />
      )}
      <Text
        style={{
          textDecorationStyle: 'solid',
          color: COLOR_SCHEME.GREEN,
          fontWeight: 'bold',
          ...(style || {}),
        }}>
        {children}
      </Text>
      {!noArrow && (
        <FontAwesomeIcon
          name="long-arrow-right"
          style={{
            color: COLOR_SCHEME.GREEN,
            marginLeft: 10,
            ...(style || {}),
          }}
        />
      )}
    </TouchableOpacity>
  );
};
