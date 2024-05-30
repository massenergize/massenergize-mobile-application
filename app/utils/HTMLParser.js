/******************************************************************************
 *                            HTMLParser
 * 
 *      This page is responsible for rendering the information sent in the
 *      format of HTML into a React Native page. 
 * 
 *      Written by: Moizes Almeida
 *      Last edited: May 29, 2024
 * 
 *****************************************************************************/

import React from "react";
import HTMLRender from "react-native-render-html";
import { useWindowDimensions, StyleSheet } from "react-native";

const HTMLParser = React.memo(({ htmlString, baseStyle }) => {
    /* Gets the dimension of the device */
    const { width } = useWindowDimensions();

    /* Sets up the configuration of the information sent to this function  */
    const htmlConfig = {
        baseStyle: StyleSheet.flatten(baseStyle),
        tagStyles: {
            strong: {
                color: "#64b058",
            },
        },
    };

    /* Renders the information sent using the HTMLRender component */
    return (
        <HTMLRender
            contentWidth = {width}
            source = {{ html: htmlString }}
            {...htmlConfig}
        />
    )
});

export default HTMLParser;