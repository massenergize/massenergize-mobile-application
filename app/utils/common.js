import Snackbar from 'react-native-snackbar';

export const isValidZipCode = zipCode => {
  const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
  return zipCodePattern.test(zipCode);
};

export const groupCommunities = communities => {
  communities = communities.filter(c => c.is_geographically_focused);
  const matches = communities.filter(c => c.location.distance === 0);
  const near = communities
    .filter(c => c.location.distance !== 0)
    .sort((a, b) => a.location.distance - b.location.distance);
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
