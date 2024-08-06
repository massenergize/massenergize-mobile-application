/******************************************************************************
 *                            ZipCodeInput
 * 
 *      This page is responsible for rendering the zip code input
 *      component use to get the user's zipcode.
 * 
 *      Written by: Frimpong Opoku-Agyemang and Will Soylemez
 *      Last edited: July 16, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import {View, Text, Checkbox, Alert} from 'react-native';
import React, {useState} from 'react';
import Textbox from '../../components/textbox/Textbox';
import Slider from '@react-native-community/slider';
import MEButton from '../../components/button/MEButton';
import {COLOR_SCHEME} from '../../stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchCommunities, setZipCodeOptions} from '../../config/redux/actions';

const ZipCodeInput = ({
  updateOptions,
  zipcodeOptions,
  fetchCommunitiesFromBackend,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const {zipcode, miles} = zipcodeOptions || {};
  const [newZipcode, setNewZipcode] = useState(zipcode);
  const [newMiles, setNewMiles] = useState(miles);

  /* Handles the search */
  const search = () => {
    const newZipcodeOptions = {zipcode: newZipcode, max_distance: newMiles};
    setLoading(true);
    fetchCommunitiesFromBackend(newZipcodeOptions, (data, error) => {
      if (!data) {
        setLoading(false);
        return Alert.alert(error);
      }
      updateOptions({zipcode: newZipcode, miles: newMiles});
      setLoading(false);
      closeModal();
    });
  };

  
  return (
    <View style={{padding: 20}}>
      <Textbox
        generics={{keyboardType: 'decimal-pad', maxLength: 5}}
        onChange={code => setNewZipcode(code)}
        label="What's your community's zipcode? *"
        placeholder="Enter zipcode here..."
        value={newZipcode}
      />
      <Text>Include nearby communities (Optional) </Text>
      <Slider
        onValueChange={value => setNewMiles(value)}
        step={1}
        minimumTrackTintColor={COLOR_SCHEME.GREEN}
        thumbTintColor={COLOR_SCHEME.GREEN}
        maximumValue={100}
        minimumValue={0}
        value={newMiles}></Slider>
      <Text>Within {newMiles} Miles</Text>
      <MEButton loading={loading} onPress={search}>
        SEARCH
      </MEButton>
    </View>
  );
};

const mapStateToProps = state => {
  return {zipcodeOptions: state.zipcodeOptions};
};

const mapDispatch = dispatch => {
  return bindActionCreators(
    {
      updateOptions: setZipCodeOptions,
      fetchCommunitiesFromBackend: fetchCommunities,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatch)(ZipCodeInput);
