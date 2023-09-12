import React from 'react';
import 'react-native-reanimated';
import {Provider} from 'react-redux';
import store from './app/config/redux/store';
import RootWrapper from './app/pages/RootWrapper';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootWrapper />
      </NavigationContainer>
    </Provider>
  );
}
