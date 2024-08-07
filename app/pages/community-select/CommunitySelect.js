/******************************************************************************
 *                            CommunitySelect
 * 
 *      This page is responsible for rendering the page for the
 *      user to select the community they are part of.
 * 
 *      Written by: Frimpong, Moizes Almeida, and Will Soylemez
 *      Last edited: July 16, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLOR_SCHEME } from '../../stylesheet';
import { FontAwesomeIcon } from '../../components/icons';

import HStack from '../../components/stacks/HStack';
import { bindActionCreators } from 'redux';
import {
  setActiveCommunityAction,
  toggleUniversalModalAction,
} from '../../config/redux/actions';
import { connect } from 'react-redux';
import ZipCodeInput from './ZipCodeInput';
import Loader from '../../components/loaders/Loader';
import {
  COMMUNITY_CHOICE,
  LOADING,
  ZIP_CODE_OPTIONS_STORAGE_KEY,
} from '../../utils/values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupCommunities } from '../../utils/common';
import CommunityCard from './CommunityCard';
import { ImageBackground } from '@gluestack-ui/themed';
import Geolocation from '@react-native-community/geolocation';

const CommunitySelect = ({
  toggleModal,
  zipcodeOptions,
  communities,
  navigation,
  setActiveCommunity,
}) => {
  const [{ zipcode, miles }, setZipcodeOptions] = useState(zipcodeOptions || {});


  /* Getting the zipcode from eihter the input or the user's location */
  useEffect(() => {
    // If the zipcode is already set, then we don't need to do anything
    if (zipcodeOptions.zipcode) {
      setZipcodeOptions(zipcodeOptions);
      return;
    }

    Geolocation.getCurrentPosition(position => {
      console.log("USER_POSITION:", position);
      // Use the nominatim API to get the zipcode
      const params = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        format: 'json',
      };
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${params.lat}&lon=${params.lon}&format=json`)
        .then(response => response.json())
        .then(data => {
          console.log("ZIPCODE:", data.address.postcode);
          setZipcodeOptions({ zipcode: data.address.postcode, miles: miles });
        })

    });
  }, [zipcodeOptions]);

  /* Function to choose a community */
  const chooseCommunity = async community => {
    setActiveCommunity(community);
    const id = community?.id;
    await AsyncStorage.setItem(COMMUNITY_CHOICE, id?.toString());
    navigation.navigate('Loading', { community_id: id });
  };

  /* Gets the list of communities */
  const organisedData = () => {
    if (communities === LOADING)
      return { fetchingContent: true, geographically_focused: [], not_geographically_focused: [] };

    return groupCommunities(communities);
    // return communities;
  };
  let { fetchingContent, geographically_focused, not_geographically_focused } = organisedData();

  /* Renders the list of communities */
  const renderCommunityList = (communityList, title) => {
    if (fetchingContent) return <Loader />;
    if ((!fetchingContent && !communityList?.length) || !communities)
      return (
        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', color: COLOR_SCHEME.GREEN, marginBottom: 15 }}>
          No matching communities found.
        </Text>
      );
    return (
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: COLOR_SCHEME.GREEN, marginBottom: 15 }}>
          {title}
        </Text>

        {communityList?.map((community, index) => (
          <View key={index.toString()}>
            <CommunityCard
              {...community}
              onPress={() => chooseCommunity(community)}
            />
          </View>
        ))}
      </View>
    );
  };

  /* The main return statement */
  return (
    <SafeAreaView edges={['top']}>
      <View style={{ height: '100%', backgroundColor: 'white' }}>
        <ImageBackground
          source={require("../../assets/community-search.png")}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
          }}
        />

        {/* Header */}
        <View
          style={{
            width: "100%",
            height: '30%',
            backgroundColor: 'rgba(100, 186, 87, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: "absolute",
            top: 0,
          }}>
          <FontAwesomeIcon name="group" size={48} color="white" />
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
              marginTop: 20,
              width: '70%',
              textAlign: 'center',
            }}>
            Become Part of a Community
          </Text>
        </View>

        {/* Zipcode enter */}
        <View
          style={{
            height: '75%',
            backgroundColor: 'white',
            marginTop: -20,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <TouchableOpacity
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              alignItems: 'center',
              width: '100%',
              flexDirection: 'row',
              backgroundColor: COLOR_SCHEME.LIGHT_GREY,
              justifyContent: 'center',
            }}
            onPress={() =>
              toggleModal({
                isVisible: true,
                Component: ZipCodeInput,
                title: 'Find your community with your zipcode',
              })
            }
          >
            <FontAwesomeIcon name="search" size={20} color={COLOR_SCHEME.GREEN} />
            <Text
              asLink
              icon="search"
              noArrow
              style={{ fontSize: 16, fontWeight: 'bold', color: COLOR_SCHEME.GREEN, marginLeft: 10 }}
              iconStyle={{ fontSize: 15 }}>
              Find communities near your zipcode
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              backgroundColor: COLOR_SCHEME.MEDIUM_GREY,
              paddingVertical: 5,
              paddingHorizontal: 30,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>
              Showing communities near {zipcode} (within {miles} miles)
            </Text>
          </View>

          {/* Community list */}
          <ScrollView
            verticals
            style={{ paddingHorizontal: 20, paddingVertical: 20 }}
          >
            {renderCommunityList(geographically_focused, "MATCHED COMMUNITIES")}

            {renderCommunityList(not_geographically_focused, "NON-GEOGRAPHICALLY FOCUSED COMMUNITIES")}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
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
      setActiveCommunity: setActiveCommunityAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySelect);
