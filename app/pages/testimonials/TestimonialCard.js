/******************************************************************************
 *                            TestimonialCard
 * 
 *      This page is responsible for rendering the card that displays
 *      a single testimonial.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/


import React from "react";
import Moment from 'moment';
import { Box, Text, Pressable, Image, Button } from "@gluestack-ui/themed-native-base";
import MEImage from "../../components/image/MEImage";

function TestimonialCard({ navigation, data, picture }) {
  return (
    <Pressable onPress={() => navigation.navigate("TestimonialDetails", { data: data, testimonial_id: data.id })}  >
      <Box
        mx={3}
        mt={2}
        bg="white"
        borderRadius="2xl"
        shadow={2}
      >
        <Box
          width="100%"
          maxHeight={150}
          mt={3}
        >

          {/* Image */}
          <MEImage
            source={{
              uri: data?.file?.url
            }}
            alt={data?.file?.url}
            w="full"
            resizeMode="contain"
            h="full"
          />
        </Box>

        {/* Content */}
        <Box p={3}>
          <Text bold fontSize="lg">{data.title}</Text>
          <Text fontSize="sm" color="#BAB9C0">By {data.preferred_name} | {Moment(data.created_at).format('l')}</Text>
          {
            (data.action != null) ? <Text fontSize="sm" color="primary.400">{data.action.title}</Text> : <></>
          }
          {/* {Remove the html symbols} */}
          <Text isTruncated={true} noOfLines={3}>{data.body.replace(/(<([^>]+)>)/gi, "")}</Text>
        </Box>
      </Box>
    </Pressable>
  );
}

export { TestimonialCard }