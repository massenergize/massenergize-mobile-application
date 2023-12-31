import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import MEDrawerNavigator from '../components/drawer/Drawer';
import MEBottomSheet from '../components/modal/MEBottomSheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  fetchCommunities,
  fetchUserProfile,
  setActiveCommunityAction,
  setFirebaseAuthenticationAction,
  toggleUniversalModalAction,
} from '../config/redux/actions';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {isUserAuthenticated} from '../config/firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import CommunitySelect from './community-select/CommunitySelect';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoadingScreen from './misc/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COMMUNITY_CHOICE} from '../utils/values';

GoogleSignin.configure({
  webClientId:
    '738582671182-6b94m9ot6jq3srhglag94atpjrhnhc7g.apps.googleusercontent.com',
});

const MainStack = createStackNavigator();

const RootWrapper = ({
  zipcodeOptions,
  modalOptions,
  toggleModal,
  setFirebaseAuth,
  fetchCommunitiesFromBackend,
  // communities,
  activeCommunity,
  setActiveCommunity,
  fetchMEUser,
}) => {
  const navigation = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem(COMMUNITY_CHOICE)
      .then(choice => {
        if (!choice) return;
        navigation.navigate('Loading', {community_id: choice});
      })
      .catch(e => console.log('ERROR_FETCHING_SAVED_CHOICE', e.toString()));
  }, []);

  useEffect(() => {
    const {zipcode, miles} = zipcodeOptions || {};
    // First time app launches, it will load a few communities at 10 miles... (zipcode is set as wayland zip, and 10 miles check reducers.js)
    fetchCommunitiesFromBackend({zipcode, maxDistance: miles}, data => {
      if (!data || activeCommunity?.id) return;
      // There is a scenario where the list of communities will not be ready by the time the useEffect above has retrieved a saved community choice
      // In that case, that process can go ahead and load the other community data.
      // When the community list is retrieved, the object of the chosen community will be found here
      // and set to redux quitely
      // Catch: all of this is if activeCommunity value in redux store is empty ofcourse
      AsyncStorage.getItem(COMMUNITY_CHOICE)
        .then(choice => {
          const found = data?.find(com => com.id?.toString() === choice);
          if (!found) return navigation.navigate('CommunitySelectionPage'); // This means the saved choice of community is not in the community list retrieved. In such case we go babck to community selection page
          setActiveCommunity(found);
        })
        .catch(e =>
          console.log(
            'ERROR_FINDING_COMMUNITY_OBJECT_FOR_SAVED_CHOICE',
            e.toString(),
          ),
        );
    });
  }, []);

  useEffect(() => {
    isUserAuthenticated((yes, user) => {
      console.log('USER IS FIREBASE_AUTHENTICATED: ', user?.email);
      if (yes) {
        setFirebaseAuth(user);
        user?.getIdToken().then(token => {
          fetchMEUser(token);
        });
      } else console.log('User is not signed in yet!');
    });
  }, []);

  return (
    // <NavigationContainer>
    <>
      <MainStack.Navigator initialRouteName="CommunitySelectionPage">
        <MainStack.Screen
          options={{headerShown: false}}
          name="CommunitySelectionPage"
          component={CommunitySelect}
        />
        <MainStack.Screen
          options={{headerShown: false}}
          name="CommunityPages"
          component={MEDrawerNavigator}
        />
        <MainStack.Screen
          options={{headerShown: false}}
          name="Loading"
          component={LoadingScreen}
        />
      </MainStack.Navigator>
      <MEBottomSheet
        onClose={() => toggleModal({isVisible: false, component: <></>})}
        {...(modalOptions || {})}
      />
    </>
    // </NavigationContainer>
  );
};
const mapStateToProps = state => ({
  modalOptions: state.modalOptions,
  fireAuth: state.fireAuth,
  zipcodeOptions: state.zipcodeOptions,
  activeCommunity: state.activeCommunity,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
      setFirebaseAuth: setFirebaseAuthenticationAction,
      fetchCommunitiesFromBackend: fetchCommunities,
      setActiveCommunity: setActiveCommunityAction,
      fetchMEUser: fetchUserProfile,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootWrapper);
