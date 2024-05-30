import React from "react";
import HTMLRender from "react-native-render-html";
import { useWindowDimensions, StyleSheet } from "react-native";

export default HTMLParser = React.memo(({ htmlString, baseStyle }) => {
  const { width } = useWindowDimensions();
  const htmlConfig = {
    baseStyle: StyleSheet.flatten(baseStyle),
    tagsStyles: {
      // TODO: Change color dynamically according to theme.
      strong: {
        color: "#64b058",
      },
    },
  };
  return (
    <HTMLRender
      contentWidth={width}
      source={{ html: htmlString }}
      {...htmlConfig}
    />
  );
});
