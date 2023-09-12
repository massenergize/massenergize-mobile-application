import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import MEDrawerNavigator from '../components/drawer/Drawer';
import MEBottomSheet from '../components/modal/MEBottomSheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  setFirebaseAuthenticationAction,
  toggleUniversalModalAction,
} from '../config/redux/actions';
import {NavigationContainer} from '@react-navigation/native';
import {isUserAuthenticated} from '../config/firebase';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import CommunitySelect from './community-select/CommunitySelect';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

GoogleSignin.configure({
  webClientId:
    '738582671182-6b94m9ot6jq3srhglag94atpjrhnhc7g.apps.googleusercontent.com',
});

const MainStack = createStackNavigator();

const RootWrapper = ({modalOptions, toggleModal, setFirebaseAuth}) => {
  useEffect(() => {
    isUserAuthenticated((yes, user) => {
      if (yes) setFirebaseAuth(user);
      else console.log('User is not signed in yet, do something!');
    });
  }, []);
  return (
    <NavigationContainer>
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
      </MainStack.Navigator>
      <MEBottomSheet
        onClose={() => toggleModal({isVisible: false, component: <></>})}
        {...(modalOptions || {})}
      />
    </NavigationContainer>
  );
};
const mapStateToProps = state => ({
  modalOptions: state.modalOptions,
  fireAuth: state.fireAuth,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
      setFirebaseAuth: setFirebaseAuthenticationAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootWrapper);
