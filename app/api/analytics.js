/******************************************************************************
 *                            analytics.js
 * 
 *      This file contains functions that are used to log events and set user
 *      properties in Firebase Analytics.
 * 
 *      Written by: Moizes Almeida and William Soylemez
 *      Last edited: July 25, 2024
 * 
 *****************************************************************************/


import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';


/*************** Generic Functions *****************/
export const logEvent = (eventName, eventParams) => {
  console.log(`Logging event: ${eventName} with params: ${JSON.stringify(eventParams)}`);
  firebase.analytics().logEvent(eventName, eventParams);
};

export const setUserProperties = (userProperties) => {
  firebase.analytics().setUserProperties(userProperties);
};


/*************** Specific Functions *****************/

// Events

export const logEventUserSignup = () => {
  logEvent('user_signup', {});
}

export const logEventUserLogin = (platform) => {
  logEvent('user_login', { platform: platform });
};

export const logEventUserLogout = () => {
  logEvent('user_logout', {});
};

export const logEventOpenPage = (pageName) => {
  logEvent('open_page', { page_name: pageName });
};

export const logEventAddTodoAction = (action) => {
  logEvent('add_to_todo_list', { action: action });
}

export const logEventRemoveTodoAction = (action) => {
  logEvent('remove_from_todo_list', { action: action });
}

export const logEventAddCompletedAction = (action) => {
  logEvent('add_to_completed', { action: action });
}

export const logEventRemoveCompletedAction = (action) => {
  logEvent('remove_from_completed', { action: action });
}

export const logEventShareAction = (action, platform) => {
  logEvent('share_action', { action: action, platform: platform });
}

export const logEventAddEventToCalendar = (event) => {
  logEvent('add_event_to_calendar', { event: event });
}

export const logEventJoinTeam = (teamName) => {
  logEvent('join_team', { team_name: teamName });
}

// For adding events, teams, and testimonials
export const logEventCreateContent = (contentType) => {
  logEvent('create_content', { content_type: contentType });
}


// User Properties
// Sets user properties based on the user object
export const setUserPropertiesFromUser = (user) => {

  // Account age
  const accountAge = Date.now() - Date.parse(user.joined);
  let accountAgeString = '';
  if (accountAge < 604800000) accountAgeString = '0-1w';
  else if (accountAge < 2592000000) accountAgeString = '1-4w';
  else if (accountAge < 7776000000) accountAgeString = '1-3m';
  else if (accountAge < 15552000000) accountAgeString = '3-6m';
  else if (accountAge < 31536000000) accountAgeString = '6-12m';
  else accountAgeString = '1y+';

  if (user) {
    setUserProperties({
      email: user.email,
      community: user.communities[0]?.name,
      account_age: accountAgeString,
    });
  }
}

// Sets actions completed string
export const setUserActionsCompleted = (completedList) => {
  if (!completedList) return;

  const actionsCompleted = completedList.length;
  let actionsCompletedString = '';
  if (actionsCompleted === 0) actionsCompletedString = '0';
  else if (actionsCompleted < 5) actionsCompletedString = '1-4';
  else if (actionsCompleted < 10) actionsCompletedString = '5-9';
  else if (actionsCompleted < 20) actionsCompletedString = '10-19';
  else actionsCompletedString = '20+';
  setUserProperties({ actions_completed: actionsCompletedString });
}



// Session duration functions
export const startSession = () => {
  firebase.analytics().logEvent('session_start', {});
  AsyncStorage.setItem('sessionStartTime', Date.now().toString());
}

export const endSession = () => {
  AsyncStorage.getItem('sessionStartTime').then((sessionStartTime) => {
    const sessionDuration = Date.now() - parseInt(sessionStartTime);
    firebase.analytics().logEvent('session_end', { session_duration: sessionDuration });

    // // Update total session duration
    // AsyncStorage.getItem('totalSessionDuration').then((totalSessionDuration) => {
    //   const newTotalSessionDuration = totalSessionDuration ? (parseInt(totalSessionDuration) + sessionDuration) : sessionDuration;
    //   AsyncStorage.setItem('totalSessionDuration', newTotalSessionDuration.toString());
    //   // Update session count
    // });
  });
}