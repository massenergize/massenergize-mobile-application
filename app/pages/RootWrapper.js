/******************************************************************************
 *                            RootWrapper
 * 
 *      This page contains the main navigation stack as well as global
 *      functions and navigation flow. It is the first page that is rendered
 *      when the app is opened. This page causes the app to navigate to the
 *      appropriate page based on the user's current state. This page also
 *      causes the user data to be refreshed when auth state changes.
 * 
 *      Written by: William Soylemez
 *      Last edited: July 29, 2024
 * 
 *****************************************************************************/

import { AppState } from 'react-native';
import React, { useEffect } from 'react';
import MEDrawerNavigator from '../components/drawer/Drawer';
import MEBottomSheet from '../components/modal/MEBottomSheet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  fetchCommunities,
  fetchUserProfile,
  setActiveCommunityAction,
  setFirebaseAuthenticationAction,
  toggleUniversalModalAction,
  fetchAllUserInfo,
  setQuestionnaireInfo
} from '../config/redux/actions';
import { useNavigation } from '@react-navigation/native';
import { isUserAuthenticated } from '../config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import CommunitySelect from './community-select/CommunitySelect';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './misc/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMMUNITY_CHOICE, DONE_ONBOARDING, QUESTIONNAIRE_DATA } from '../utils/values';
import ActionDetails from './actions/ActionDetails';
import EventDetails from './events/EventDetails';
import OnboardingPage from './onboarding/Onboarding';
import TeamDetails from './teams/TeamDetails';
import Login from './auth/Login';
import Register from './auth/Register';
import ServiceProviderDetails from './service-providers/ServiceProviderDetails';
import TestimonialDetails from './testimonials/TestimonialDetails';
import ForgotPassword from './auth/ForgotPassword';
import SettingsPage from './user-profile/SettingsPage';
import ActionsScreen from './actions/ActionsScreen';
import EventsScreen from './events/EventsScreen';
import ImpactPage from './home/ImpactPage';
import AddTestimonial from './testimonials/AddTestimonial';
import EmailOnly from './auth/EmailOnly';
import AddEvent from './events/AddEvent';
import AddTeam from './teams/AddTeam';
import Questionnaire from './onboarding/Questionnaire';
import { endSession, startSession } from '../api/analytics';

GoogleSignin.configure({
  webClientId:
    '72842344535-02nclr1jgldostc3ajve2up59ice44gv.apps.googleusercontent.com',
});

const MainStack = createStackNavigator();

const screenOptions = {
  // headerShown: false,
  headerTintColor: "black",
  headerBackTitleVisible: false,
};

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
  fetchAllUserInfo,
  setQuestionnaireInfo
}) => {
  const navigation = useNavigation();

  /* Effect for navigating to loading screen if saved community, or back to
   * onboarding if needed
   */
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(COMMUNITY_CHOICE),
      AsyncStorage.getItem(DONE_ONBOARDING),
    ])
      .then(response => {
        const [choice, onboarding] = response;
        if (!onboarding) return navigation.navigate('Onboarding');
        if (!choice) return navigation.navigate('CommunitySelectionPage');
        navigation.navigate('Loading', { community_id: choice });
      })
      .catch(e => console.log('ERROR_FETCHING_SAVED_CHOICE', e.toString()));
  }, []);

  /* Get the list of communities from the backend and current community choice */
  useEffect(() => {
    const { zipcode, miles } = zipcodeOptions || {};
    // First time app launches, it will load a few communities at 10 miles... (zipcode is set as wayland zip, and 10 miles check reducers.js)
    fetchCommunitiesFromBackend({ zipcode, maxDistance: miles }, data => {
      if (!data || activeCommunity?.id) return;
      // There is a scenario where the list of communities will not be ready by the time the useEffect above has retrieved a saved community choice
      // In that case, that process can go ahead and load the other community data.
      // When the community list is retrieved, the object of the chosen community will be found here
      // and set to redux quitely
      // Catch: all of this is if activeCommunity value in redux store is empty ofcourse
      AsyncStorage.getItem(COMMUNITY_CHOICE)
        .then((communityChoice) => {
          // If there is no saved community choice, we go to community selection page
          const found = data?.find(com => com.id?.toString() === communityChoice);
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

  /* Check if user is authenticated */
  useEffect(() => {
    isUserAuthenticated((yes, user) => {
      console.log('USER IS FIREBASE_AUTHENTICATED: ', user?.email);
      if (yes) {
        setFirebaseAuth(user);
        user?.getIdToken().then(token => {
          fetchMEUser(token);
        });
        fetchAllUserInfo();
      } else console.log('User is not signed in yet!');
    });
  }, []);

  /* Check for questionaire completion */
  useEffect(() => {
    AsyncStorage.getItem(QUESTIONNAIRE_DATA)
      .then(data => {
        setQuestionnaireInfo(JSON.parse(data));
      })
      .catch(e => console.log('ERROR_FETCHING_QUESTIONAIRE_DATA', e.toString()));
  }, []);

  /* Log opening and closing app */
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        startSession();
      } else if (nextAppState.match(/background/)) {
        endSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    // <NavigationContainer>
    <>
      {/* Main app navigation stack */}
      <MainStack.Navigator screenOptions={screenOptions} initialRouteName="Onboarding">
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Onboarding"
          component={OnboardingPage}
        />
        <MainStack.Screen
          // options={{headerShown: false}}
          name="Questionnaire"
          component={Questionnaire}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="CommunitySelectionPage"
          component={CommunitySelect}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="CommunityPages"
          component={MEDrawerNavigator}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="Impact"
          component={ImpactPage}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Loading"
          component={LoadingScreen}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="ActionDetails"
          component={ActionDetails}
        />
        <MainStack.Screen
          name='Actions'
          component={ActionsScreen}
        />
        <MainStack.Screen
          name="ServiceProviderDetails"
          component={ServiceProviderDetails}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="TestimonialDetails"
          component={TestimonialDetails}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="EventDetails"
          component={EventDetails}
        />
        <MainStack.Screen
          name="Events"
          component={EventsScreen}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="SubteamDetails"
          component={TeamDetails}
        />
        <MainStack.Screen
          options={{ headerTitle: '' }}
          name="TeamDetails"
          component={TeamDetails}
        />
        <MainStack.Screen
          name="Login"
          component={Login}
        />
        <MainStack.Screen
          name="Register"
          component={Register}
        />
        <MainStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <MainStack.Screen
          name="EmailOnly"
          component={EmailOnly}
        />
        <MainStack.Screen
          name="Settings"
          component={SettingsPage}
        />
        <MainStack.Screen
          options={{
            headerTitle: ''
          }}
          name="AddTestimonial"
          component={AddTestimonial}
        />
        <MainStack.Screen
          options={{
            headerTitle: ''
          }}
          name="AddEvent"
          component={AddEvent}
        />
        <MainStack.Screen
          options={{
            headerTitle: ''
          }}
          name="AddTeam"
          component={AddTeam}
        />
      </MainStack.Navigator>
      <MEBottomSheet
        {...(modalOptions || {})}
        onClose={() => {
          toggleModal({ isVisible: false, component: <></> });
          modalOptions?.onClose && modalOptions.onClose();
        }}
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
      fetchAllUserInfo: fetchAllUserInfo,
      setQuestionnaireInfo: setQuestionnaireInfo
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootWrapper);
