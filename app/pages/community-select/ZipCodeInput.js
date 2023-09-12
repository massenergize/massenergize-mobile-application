import {View, Text, Checkbox} from 'react-native';
import React from 'react';
import Textbox from '../../components/textbox/Textbox';
import Slider from '@react-native-community/slider';
import MEButton from '../../components/button/MEButton';
import {COLOR_SCHEME} from '../../stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setZipCodeOptions} from '../../config/redux/actions';

const ZipCodeInput = ({updateOptions, zipcodeOptions}) => {
  const {zipcode, miles} = zipcodeOptions || {};

  const doUpdate = (name, value) => {
    updateOptions({...zipcodeOptions, [name]: value});
  };
  return (
    <View style={{padding: 20}}>
      <Textbox
        generics={{keyboardType: 'numeric', maxLength: 5}}
        onChange={code => doUpdate('zipcode', code)}
        label="What's your community's zipcode? *"
        placholder="Enter zipcode here..."
        value={zipcode}
      />
      <Text>Include nearby communities (Optional) </Text>
      <Slider
        onValueChange={value => doUpdate('miles', value)}
        step={1}
        minimumTrackTintColor={COLOR_SCHEME.GREEN}
        thumbTintColor={COLOR_SCHEME.GREEN}
        maximumValue={100}
        minimumValue={0}
        value={miles}></Slider>
      <Text>Within {miles} Miles</Text>
      <MEButton>SEARCH</MEButton>
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
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatch)(ZipCodeInput);
