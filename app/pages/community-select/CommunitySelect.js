import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {COLOR_SCHEME} from '../../stylesheet';
import {FontAwesomeIcon} from '../../components/icons';

import HStack from '../../components/stacks/HStack';
import VStack from '../../components/stacks/VStack';
import Textbox from '../../components/textbox/Textbox';
import Slider from '@react-native-community/slider';
import MEButton from '../../components/button/MEButton';
import {bindActionCreators} from 'redux';
import {toggleUniversalModalAction} from '../../config/redux/actions';
import {connect} from 'react-redux';
import ZipCodeInput from './ZipCodeInput';
import Loader from '../../components/loaders/Loader';
import {
  COMMUNITY_CHOICE,
  LOADING,
  ZIP_CODE_OPTIONS_STORAGE_KEY,
} from '../../utils/values';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunitySelect = ({
  toggleModal,
  zipcodeOptions,
  communities,
  navigation,
}) => {
  const {zipcode, miles} = zipcodeOptions || {};

  // useEffect(() => {
  //   AsyncStorage.getItem(COMMUNITY_CHOICE)
  //     .then(choice => {
  //       if (choice)
  //         return navigation.navigate('Loading', {community_id: choice});
  //     })
  //     .catch(e => console.log('Hwat happened', e.toString()));
  //   // console.log('WHATS THE VERDICT: ', choice);
  // }, []);

  const organisedData = () => {
    if (communities === LOADING)
      return {fetchingContent: true, matches: [], near: []};
    return communities;
  };
  let {fetchingContent, matches, near} = organisedData();

  const renderMatches = () => {
    if (fetchingContent) return <></>;
    if ((!fetchingContent && !matches?.length) || !communities)
      return (
        <Text style={{marginVertical: 10}}>
          Sorry we could not find any communities in the zipcode...
        </Text>
      );
    return matches?.map((community, index) => (
      <View key={index.toString()}>
        <OneCommunityItem
          {...community}
          onPress={() => chooseCommunity(community?.id)}
        />
      </View>
    ));
  };
  const chooseCommunity = async id => {
    await AsyncStorage.setItem(COMMUNITY_CHOICE, id?.toString());
    navigation.navigate('Loading', {community_id: id});
  };

  const renderNearByCommunities = () => {
    if (fetchingContent || (!fetchingContent && !near?.length)) return <></>;

    return near?.map((community, index) => (
      <View key={index.toString()}>
        <OneCommunityItem
          {...community}
          onPress={() => chooseCommunity(community?.id)}
        />
      </View>
    ));
  };

  return (
    <SafeAreaView>
      <View style={{height: '100%'}}>
        <View
          style={{
            height: '30%',
            backgroundColor: COLOR_SCHEME.GREEN,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesomeIcon name="group" size={32} color="white" />
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: 'white',
              marginTop: 20,
              width: '70%',
              textAlign: 'center',
            }}>
            Become Part of a Community
          </Text>
        </View>
        <View
          style={{
            height: '75%',
            backgroundColor: 'white',
            marginTop: -20,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <HStack
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              alignItems: 'center',
              width: '100%',
              backgroundColor: COLOR_SCHEME.LIGHT_GREY,
            }}>
            <VStack>
              <MEButton
                onPress={() =>
                  toggleModal({
                    isVisible: true,
                    Component: ZipCodeInput,
                    title: 'Find your community with your zipcode',
                  })
                }
                asLink
                icon="search"
                noArrow
                style={{fontSize: 16}}
                iconStyle={{fontSize: 15}}>
                Find communities with your zipcode
              </MEButton>
            </VStack>
          </HStack>
          <HStack
            style={{
              width: '100%',
              backgroundColor: '#e3e1e1',
              paddingVertical: 5,
              paddingHorizontal: 45,
            }}>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black'}}>
              Zipcode: {zipcode}, ({miles} miles) Near me
            </Text>
          </HStack>

          <ScrollView
            verticals
            style={{paddingHorizontal: 20, paddingVertical: 20}}>
            <Text style={{fontWeight: '400', color: 'grey', fontSize: 12}}>
              MATCHED COMMUNITIES
            </Text>

            {fetchingContent && <Loader />}

            {renderMatches()}
            {near.length ? (
              <Text
                style={{
                  fontWeight: '400',
                  paddingTop: 15,
                  color: 'grey',
                  fontSize: 12,
                }}>
                COMMUNITIES NEARBY
              </Text>
            ) : (
              <></>
            )}

            {renderNearByCommunities()}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const OneCommunityItem = ({
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

const mapStateToProps = state => ({
  zipcodeOptions: state.zipcodeOptions,
  communities: state.communities,
});
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySelect);
