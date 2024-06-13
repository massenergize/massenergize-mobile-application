/******************************************************************************
 *                            ActionCard
 * 
 *      This page is responsible for rendering the card that displays
 *      a single action
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import React, { useState, useEffect } from "react";
import { Text, Pressable } from "react-native";
import { Box, Heading, Stack } from "@gluestack-ui/themed-native-base";
import MEImage from "../../components/image/MEImage";

const ActionCard = ({
  navigation,
  id,
  title,
  imgUrl,
  impactMetric = "Low",
  costMetric = "0",
  ...props
}) => {
  return (

    /* On press, navigate to the ActionDetails screen with the action_id */
    <Pressable
      onPress={() => {
        navigation.navigate("ActionDetails", { action_id: id });
      }}
      {...props}
    >

      {/* Action Card */}
      <Box bg="white" borderRadius="xl" shadow={2} width={180} {...props}>
        
        {/* Image */}
        <Box>
          <MEImage
            source={{ uri: imgUrl }}
            alt="image"
            borderTopRadius="xl"
            resizeMode="cover"
            height={120}
            bg="gray.300"
            altComponent={<Box height={120} bg="gray.300" borderTopRadius="xl" />}
          />
        </Box>

        {/* Text */}
        <Stack p={3} space={3}>
          <Stack space={2}>
            <Heading size="sm" isTruncated={true} noOfLines={1}>
              {title ? title : "Action Title"}
            </Heading>
            <Text fontSize="xs" fontWeight="500">
              {`${impactMetric} Impact | ${costMetric}`}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Pressable>
  );
}

export default React.memo(ActionCard);
