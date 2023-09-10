import React from 'react';
import 'react-native-reanimated';
import {Provider} from 'react-redux';
import store from './app/config/redux/store';
import RootWrapper from './app/pages/RootWrapper';

export default function App() {
  return (
    <Provider store={store}>
      <RootWrapper />
    </Provider>
  );
}
