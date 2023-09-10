import {View, Text} from 'react-native';
import React from 'react';
import MEDrawerNavigator from '../components/drawer/Drawer';
import MEBottomSheet from '../components/modal/MEBottomSheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleUniversalModalAction} from '../config/redux/actions';
import {NavigationContainer} from '@react-navigation/native';

const RootWrapper = ({modalOptions, toggleModal}) => {
  return (
    <NavigationContainer>
      <MEDrawerNavigator />
      <MEBottomSheet
        onClose={() => toggleModal({isVisible: false, component: <></>})}
        {...(modalOptions || {})}
      />
    </NavigationContainer>
  );
};
const mapStateToProps = state => ({
  modalOptions: state.modalOptions,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootWrapper);
