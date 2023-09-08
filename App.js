import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MEDrawerNavigator from './app/components/drawer/Drawer';
import 'react-native-reanimated';


export default function App() {
  return (
    <NavigationContainer>
      <MEDrawerNavigator />
    </NavigationContainer>
  );
}
