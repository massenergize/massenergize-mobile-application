import React from 'react';
import 'react-native-reanimated';
import {Provider} from 'react-redux';
import store from './app/config/redux/store';
import RootWrapper from './app/pages/RootWrapper';
import {NavigationContainer} from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import Theme from './app/stylesheet/Theme';

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={Theme}>
        <NavigationContainer>
          <RootWrapper />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
