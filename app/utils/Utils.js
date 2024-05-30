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
  const dateOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const startDateString = startDate.toLocaleDateString("en-US", dateOptions);

  let dateRangeString;

  if (startDate.toDateString() === endDate.toDateString()) {
    // Same day then display "mm dd, hh:mm AM/PM - hh:mm AM/PM"
    dateRangeString = `${startDateString} - ${endDate.toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    )}`;
  } else {
    // Same month
    if (startDate.getMonth() === endDate.getMonth()) {
      // Display "mm dd-dd yyyy"
      dateRangeString = `${startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}-${endDate.toLocaleDateString("en-US", {
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      // Same year
      if (startDate.getFullYear() === endDate.getFullYear()) {
        // Display "mm dd - mm dd, yyyy"
        dateRangeString = `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      } else {
        // Different year then display "mm dd, yyyy - mm dd, yyyy"
        dateRangeString = `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }
    }
  }

  return dateRangeString;
}
  