import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {COLOR_SCHEME} from '../../stylesheet';
import HStack from '../../components/stacks/HStack';
import VStack from '../../components/stacks/VStack';

export default OneCommunityItem = ({
    onPress,
    name,
    is_geographically_focused,
    location,
    logo,
  }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <HStack
          style={{
            width: '100%',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: COLOR_SCHEME.LIGHT_GREY,
            paddingVertical: 10,
          }}>
          <Image
            src={logo?.url}
            // src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
            alt="Community Logo"
            style={{
              width: 70,
              height: 70,
              objectFit: 'contain',
              marginRight: 20,
            }}
          />
          <VStack style={{}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5}}>
              {name}
            </Text>
            {is_geographically_focused ? (
              <View>
                <Text style={{fontSize: 14, color: 'grey'}}>
                  {location?.city || 'null'},{' '}
                  {location?.state || location?.country || 'null'}
                </Text>
                <Text style={{fontSize: 14, color: 'grey', marginTop: 5}}>
                  {Math.round(location?.distance)} miles away
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{fontSize: 14, color: 'grey'}}>
                  {location?.country || ''}
                </Text>
                <Text style={{fontSize: 14, color: 'grey', marginTop: 5}}>
                  Non-geographically-focused
                </Text>
              </View>
            )}
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  };