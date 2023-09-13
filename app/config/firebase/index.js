import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

export const authenticateWithGmail = async cb => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    const response = await auth().signInWithCredential(googleCredential);
    // setFireAuth(response?.user);
    cb && cb(response);
  } catch (error) {
    console.error('GOOGLE_SIGN_IN_ERROR:', error);
    cb && cb(null, error?.toString());
  }
};

export const firebaseSignOut = cb => {
  auth().signOut().then(cb);
};
