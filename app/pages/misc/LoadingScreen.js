import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import VStack from '../../components/stacks/VStack';
import Loader from '../../components/loaders/Loader';
import MEButton from '../../components/button/MEButton';
import {bindActionCreators} from 'redux';
import {fetchAllCommunityData} from '../../config/redux/actions';
import HStack from '../../components/stacks/HStack';
import {connect} from 'react-redux';

const LoadingScreen = ({route, fetchAll, navigation, communityInfo }) => {
  // if we already have the community data, we can skip this screen
  const [hasError, setError] = useState(null);

  const {community_id} = route?.params || {};

  const fetch = () => {
    setError(null);
    fetchAll({community_id}, (data, error) => {
      if (!data) {
        console.log('ERROR_LOADING_COMMUNITY_DATA', error);
        return setError(error);
      }
      navigation.navigate('CommunityPages');
    });
  };
  useEffect(() => {
    fetch();
  });

  return (
    <VStack center style={{height: '100%', backgroundColor: 'white'}}>
      {hasError ? (
        <>
          <Text
            style={{textAlign: 'center', fontWeight: '500', marginBottom: 10}}>
            Sorry, we could not load the data for your selected community
          </Text>
          <HStack>
            <MEButton onPress={fetch}>Retry</MEButton>
            <MEButton
              onPress={() => navigation.navigate('CommunitySelectionPage')}
              containerStyle={{backgroundColor: 'red', marginHorizontal: 5}}>
              Go Back
            </MEButton>
          </HStack>
        </>
      ) : (
        <Loader text="Fetching community data..." />
      )}
    </VStack>
  );
};

const mapState = state => {
  return {
    communityInfo: state.communityInfo,
  };
}

const mapDispatch = dispatch => {
  return bindActionCreators(
    {
      fetchAll: fetchAllCommunityData,
    },
    dispatch,
  );
};
export default connect(mapState, mapDispatch)(LoadingScreen);
