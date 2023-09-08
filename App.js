import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MEDrawerNavigator from './app/components/drawer/Drawer';
import 'react-native-reanimated';
import {Provider} from 'react-redux';
import store from './app/config/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MEDrawerNavigator />
      </NavigationContainer>
    </Provider>
  );
}
