import Snackbar from 'react-native-snackbar';
import { apiCall } from '../api/functions';
import store from '../config/redux/store';
import { fetchAllUserInfo } from '../config/redux/actions';

export const isValidZipCode = zipCode => {
  const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
  return zipCodePattern.test(zipCode);
};

export const groupCommunities = communities => {
  communities = communities; //.filter(c => c.is_geographically_focused);
  const matches = communities; //.filter(c => c.location.distance === 0);
  const near = communities;
    //.filter(c => c.location.distance !== 0)
    //.sort((a, b) => a.location.distance - b.location.distance);
  return {matches, near};
};

export const showSnackBar = ({message, props, onPress}) => {
  Snackbar.show({
    text: message || '',
    // backgroundColor: 'green',
    fontWeight: 'bold',
    duration: Snackbar.LENGTH_INDEFINITE, // Duration options: Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG, Snackbar.LENGTH_INDEFINITE
    action: {
      text: 'Close',
      textColor: 'white',
      onPress: () => {
        onPress && onPress();
        Snackbar.dismiss();
        // Handle the action here, e.g., undo an action.
      },
    },
    ...(props || {}),
  });
};

export const showError = message => {
  showSnackBar({
    message,
    props: {
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'red',
      action: null,
    },
  });
};
export const showSuccess = message => {
  showSnackBar({
    message,
    props: {
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'green',
      action: null,
    },
  });
};

/**
 * get the metric of an action
 * @param {Object} action
 * @param {String} metric
 * @returns {String} the metric of the action
 */
export function getActionMetric(action, metric) {
  for (let i = 0; i < action?.tags?.length; i++) {
    if (action?.tags[i]?.tag_collection_name === metric) {
      return action?.tags[i]?.name;
    }
  }
  return "-";
}

/**
 * update the user in the backend then update the user in the redux store
 * @param {String} endpoint
 * @param {Object} body
 * @param {Function} callback
 */
export const updateUser = (endpoint, body, callback) => {
  apiCall(endpoint, body) // update the user in the backend
    .then(response => {
      if (!response.success) {
        callback && callback(null, response.error);
        return;
      }
      store.dispatch(fetchAllUserInfo(
        () => callback && callback(response.data)
      )); // update the user in the redux store
    });
}