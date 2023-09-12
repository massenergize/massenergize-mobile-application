import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLOR_SCHEME} from '../../stylesheet';
import {FontAwesomeIcon} from '../icons';

const MEButton = props => {
  const {children, containerStyle, style, asLink, onPress, loading, disabled} =
    props;

  if (asLink) return <LinkButton {...props} />;

  const disabledStyle = {
    backgroundColor: 'grey',
    opacity: 0.8,
  };

  const handleOnPress = () => {
    if (disabled || loading) return;
    return onPress && onPress();
  };
  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={{
        backgroundColor: COLOR_SCHEME.GREEN,
        padding: 13,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...(disabled || loading ? disabledStyle : {}),
        ...(containerStyle || {}),
      }}>
      {loading && (
        <ActivityIndicator size={22} color="white" style={{marginRight: 5}} />
      )}
      <Text
        style={{
          // textAlign: 'center',
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
