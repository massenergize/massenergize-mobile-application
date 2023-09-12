export const isValidZipCode = zipCode => {
  const zipCodePattern = /^\d{5}(?:[-\s]\d{4})?$/;
  return zipCodePattern.test(zipCode);
};
