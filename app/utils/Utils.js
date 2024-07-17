/******************************************************************************
 *                              Utils.js
 * 
 *      This page is responsible for storing the 'formatDateString'
 *      function, used to display the date of a upcoming or past
 *      event.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 17, 2024
 * 
 *****************************************************************************/

/**
 * formats a date range string based on the start and end date
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {String} if same day: "mmmm dd, hh:mm AM/PM - hh:mm AM/PM", 
 *                   if same month: "mmmm dd-dd yyyy", 
 *                   if same year: "mmmm dd - mmmm dd, yyyy", 
 *                   if different year: "mmmm dd, yyyy - mmmm dd, yyyy"
 */
export function formatDateString(startDate, endDate) {
  /* Date configuration for display */
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  /* Gets the string of the start date */
  const startDateString = startDate.toLocaleDateString("en-US", dateOptions);

  /* Creates the variable that holds the final version of the string date */
  let dateRangeString;

  /* 
   * If the start and end date are the same, then display 
   * "month dd, hh:mm AM/PM - hh:mm AM/PM" 
   */
  if (startDate.toDateString() === endDate.toDateString()) {
    dateRangeString = `${startDateString} - ${endDate.toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    )}`;
  } else {
    /* The start and end date are different */
    if (startDate.getFullYear() === endDate.getFullYear()) {
      /* The start and end date are in the same year */
      if (startDate.getMonth() === endDate.getMonth()) {
        /* The start and end date are in the same month */
        dateRangeString = `${startDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          day: "numeric",
        })}, ${endDate.getFullYear()}`;
      } else {
        /* The start and end date are in the same year but different months */
        dateRangeString = `${startDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}, ${endDate.getFullYear()}`;
      }
    } else {
      /* The start and end dates are in different years */
      dateRangeString = `${startDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} - ${endDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;
    }
  }

  return dateRangeString;
}