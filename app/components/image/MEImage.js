import React, { useState } from 'react';
import { Image } from '@gluestack-ui/themed-native-base';

const MEImage = ({ source, altComponent, ...props }) => {
  const [error, setError] = useState(false);
  if (error || !source?.uri) {
    return altComponent;
  }

  return (
    <Image
      source={source}
      {...props}
      onError={() => setError(true)}
    />
  );
}

export default MEImage;
