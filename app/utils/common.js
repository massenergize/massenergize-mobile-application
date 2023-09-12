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
