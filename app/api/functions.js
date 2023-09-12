import { IS_LOCAL } from "../config";
import URLS from "./urls";

/**
 * Handles making a POST request to the backend as a form submission
 * It also adds meta data for the BE to get context on the request coming in.
 * @param {String} destinationUrl url to send the request to
 * @param {Object} dataToSend data to be converted to form data and sent to the backend
 * @param {String} relocationPage page to redirect to if the request is successful
 * @returns
 */
export async function apiCall(
  destinationUrl,
  dataToSend = {},
  // TODO: figure out what this is for.
  relocationPage = null
) {
  // TODO: add some meta data for context in backend
  // dataToSend = {
  //     // __is_prod: IS_PROD || IS_CANARY,
  //     // ..._getCurrentCommunityContext(),
  //     ...dataToSend,
  // };

  // make leading '/' optional
  if (destinationUrl.charAt(0) === "/") {
    destinationUrl = destinationUrl.substring(1);
  }

  if (IS_LOCAL) {
    destinationUrl = "api/" + destinationUrl;
  }

  // const authToken = get_cookie(new Cookies(), "token"); // This is needed because in tests, cypress doesnt pass the token directly in the headers
  // const authTokenInLocalStorage = localStorage.getItem(AUTH_TOKEN); // This is also only used in test. Its a fallback method to retrieve token
  const formData = new FormData();

  // the request doesn't work if the form data is empty, so we need to add an empty key-value pair if dataToSend is empty
  Object.keys(dataToSend).map((k) => formData.append(k, dataToSend[k]));
  if (Object.keys(dataToSend).length === 0) {
    formData.append("", "")
  }

  // Object.keys(dataToSend).map((k) => formData.append(k, {...dataToSend[k], type: 'multipart/form-data'}));
  // if (authToken)
  //     formData.append("__token", authToken || authTokenInLocalStorage || null);

  // })
  // .catch(err => {
  //     console.log("error catch search:", err.message);
  //     fetching = false;
  //     // Choose one, depends what you need.
  //     return false; // If you want to ignore the error and do something in a chained .then()
  // })

  try {
    const response = await fetch(`${URLS.ROOT}/${destinationUrl}`, {
      credentials: "include",
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    const errorText = error.toString();
    if (errorText.search("JSON") > -1) {
      const errorMessage =
        "Invalid response to " +
        destinationUrl +
        " Data: " +
        JSON.stringify(dataToSend);
      // this will send message to Sentry Slack channel
      // Sentry.captureMessage(errorMessage);
      return { success: false, error: errorMessage };
    } else {
      // Sentry.captureException(error);
      return { success: false, error: error.toString() };
    }
  }
}
