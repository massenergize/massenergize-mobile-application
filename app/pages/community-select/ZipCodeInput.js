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

  const doUpdate = (name, value) => {
    const data = {...zipcodeOptions, [name]: value};
    updateOptions(data);
  };

  const search = () => {
    const data = {zipcode, maxDistance: miles};
    setLoading(true);
    fetchCommunitiesFromBackend(data, (data, error) => {
      if (!data) {
        setLoading(false);
        return Alert.alert(error);
      }
      setLoading(false);
      closeModal();
    });
  };
  return (
    <View style={{padding: 20}}>
      <Textbox
        generics={{keyboardType: 'number-pad', maxLength: 5}}
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
