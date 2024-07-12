/******************************************************************************
 *                            TestimonialCard
 * 
 *      This page is responsible for rendering the card that displays
 *      a single testimonial.
 * 
 *      Written by: William Soylemez and Moizes
 *      Last edited: July 12, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { Badge, Box, Pressable, Text } from "@gluestack-ui/themed-native-base";
import React from "react";
import MEImage from "../../components/image/MEImage";
import Moment from 'moment';

function TestimonialCard({
  navigation,
  data,
}) {
  /* Displays the card for the testimonial */
  return (
    <Pressable
      onPress={() => {
        if (data.is_approved) {
          navigation.navigate(
            "TestimonialDetails",
            { data: data, testimonial_id: data.id }
          );
        }
      }}
      disabled={!data.is_approved}
    >
      <Box
        mx={3}
        mt={2}
        bg="white"
        borderRadius="2xl"
        shadow={2}
        position="relative"
      >
        {/* Pending Approval Banner */}
        {
          !data.is_approved && 
          <Badge
            colorScheme="red"
            position="absolute"
            top={2}
            right={2}
            zIndex={1}
            style={{
              backgroundColor: '#DC4E34',
              color: 'white',
            }}
            _text={{
              color: "white"
            }}
          >
            Pending Approval
          </Badge>
        }

        {/* Image */}
        <Box
          width="100%"
          maxHeight={150}
          mt={3}
        >
          <MEImage
            source={{
              uri: data?.file?.url
            }}
            alt="Testimonial image"
            w="full"
            resizeMode="contain"
            h="full"
          />
        </Box>

        {/* Content */}
        <Box p={3}>
          <Text
            bold
            fontSize="lg"
          >
            {data.title}
          </Text>

          <Text 
            fontSize="sm" 
            color="#BAB9C0"
          >
            By {data?.preferred_name || 'Anonymous'} | {""}
            {Moment(data?.created_at).format('l')}
          </Text>

          {
            (data?.action != null)
              ? <Text
                  fontSize="sm"
                  color="primary.400"
                >
                  {data?.action?.title}
                </Text>
              : <></>
          }

          {/* Remove the html symbols */}
          <Text
            isTruncated={true}
            noOfLines={3}
          >
            {data?.body?.replace(/(<([^>]+)>)/gi, "")}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

export { TestimonialCard }