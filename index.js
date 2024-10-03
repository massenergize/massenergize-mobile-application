/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {getApps, initializeApp} from '@react-native-firebase/app';

if (getApps().length === 0) {
  initializeApp();
  
}
AppRegistry.registerComponent(appName, () => App);
