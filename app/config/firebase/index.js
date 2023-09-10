import auth from '@react-native-firebase/auth';

export const isUserAuthenticated = cb => {
  const subscriber = auth().onAuthStateChanged(user => {
    if (user) cb && cb(true, user);
    else cb && cb(false, null);
  });
  return subscriber;
};

export const firebaseSignOut = cb => {
  auth().signOut().then(cb);
};
