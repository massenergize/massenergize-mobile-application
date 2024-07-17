/******************************************************************************
 *                            Commons
 * 
 *      This file contains common utility functions that are used throughout
 *      the app. These functions include validation, snackbar display, and
 *      other general-purpose functions.
 * 
 *      Written by: William Soylemez and Frimpong
 *      Last edited: July 17, 2024
 * 
 *****************************************************************************/

import Snackbar from 'react-native-snackbar';

/**
 * Checks if the given zip code is valid.
 * @param {string} zipCode - The zip code to be validated.
 * @returns {boolean} - Returns true if the zip code is valid, otherwise false.
 */
export const isValidZipCode = zipCode => {
  const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
  return zipCodePattern.test(zipCode);
};

/**
 * Groups communities into matched and near categories.
 * @param {Array} communities - The list of communities to be grouped.
 * @returns {Object} - Returns an object containing matches and near 
 *                     communities.
 */
export const groupCommunities = communities => {
  communities = communities;//.filter(c => c.is_geographically_focused);
  const matches = communities;//.filter(c => c.location.distance === 0);
  const near = communities;
    // .filter(c => c.location.distance !== 0)
    // .sort((a, b) => a.location.distance - b.location.distance);
  return {matches, near};
};

/**
 * Displays a snackbar with a given message and optional properties and action.
 * @param {Object} options - Options for the snackbar.
 * @param {string} options.message - The message to be displayed in the snackbar.
 * @param {Object} options.props - Additional properties for the snackbar.
 * @param {Function} options.onPress - Function to be called when the snackbar 
 *                                     action is pressed.
 */
export const showSnackBar = ({message, props, onPress}) => {
  Snackbar.show({
    text: message || '',
    fontWeight: 'bold',
    /* 
     * Duration options: Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG, 
     * Snackbar.LENGTH_INDEFINITE 
     */
    duration: Snackbar.LENGTH_INDEFINITE, 
    action: {
      text: 'Close',
      textColor: 'white',
      onPress: () => {
        onPress && onPress();
        Snackbar.dismiss();
        /* Handle the action here, e.g., undo an action. */
      },
    },
    ...(props || {}),
  });
};

/**
 * Displays an error snackbar with a given message.
 * @param {string} message - The error message to be displayed in the snackbar.
 */
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

/**
 * Displays a success snackbar with a given message.
 * @param {string} message - The success message to be displayed in the snackbar.
 */
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
 * Retrieves the metric of an action.
 * @param {Object} action - The action object containing tags.
 * @param {String} metric - The metric to be retrieved from the action's tags.
 * @returns {String} - Returns the metric value or "-" if not found.
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
 * Checks if a firebase user has a particular provider.
 * @param {Object} user - The firebase user object.
 * @param {String} provider - The provider ID to be checked.
 * @returns {Boolean} - Returns true if the user has the specified provider, 
 *                      otherwise false.
 */
export const hasProvider = (user, provider) => {
  return user?.providerData.some(p => p.providerId === provider);
}

/** 
 * Gets user suggested actions based on questionnaire info
 * @param {Object} questionnaire - The questionnaire info object.
 * @param {Object} actions - The list of actions to be filtered.
 */
export const getSuggestedActions = (questionnaire, actions) => {
  if (!questionnaire) return actions;
  const suggestedActions = actions.filter(action => {
    const actionTags = action.tags.map(tag => tag.name);

    return (
      (questionnaire?.categories.length === 0 || 
       questionnaire?.categories.some(
        category => actionTags.includes(category)
       )) &&
      (questionnaire?.type === '' || 
       actionTags.includes(questionnaire.type)) &&
      (questionnaire?.impact === '' || 
       actionTags.includes(questionnaire.impact)) &&
      (questionnaire?.cost === '' || 
       actionTags.includes(questionnaire.cost))
    );
  });

  return suggestedActions;
}
  