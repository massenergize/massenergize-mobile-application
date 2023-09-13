import auth from '@react-native-firebase/auth';

export const isUserAuthenticated = cb => {
  const subscriber = auth().onAuthStateChanged(user => {
    if (user) cb && cb(true, user);
    else cb && cb(false, null);
  });
  return subscriber;
};

export const authenticateWithEmailAndPassword = (email, password, cb) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => cb && cb(response))
    .catch(e => cb && cb(null, e?.toString()));
};

export const authenticateWithGmail = () => { }

export const firebaseSignOut = cb => {
  auth().signOut().then(cb);
};
