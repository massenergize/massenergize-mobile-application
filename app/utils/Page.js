import React from "react";
import { View } from "@gluestack-ui/themed-native-base";

export default function Page({ children, ...props }) {
  return (
    <View backgroundColor="white" flex={1} {...props}>
      {children}
    </View>
  );
}
