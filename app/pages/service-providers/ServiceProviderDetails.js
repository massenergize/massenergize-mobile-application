/******************************************************************************
 *                            ServiceProviderDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single service provider.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  HStack,
  Text,
  Heading,
  VStack,
  Icon,
  Link,
  Image,
  ScrollView,
  Spinner,
} from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HTMLParser from "../../utils/HTMLParser";
import { useDetails } from "../../utils/hooks";
import { Linking, View } from "react-native";
import MEImage from "../../components/image/MEImage";

export default function ServiceProviderDetails({ route, navigation }) {
  const { vendor_id } = route.params;

  const [spDetails, isSpLoading] = useDetails("vendors.info", {
    vendor_id: vendor_id,
  });

  const [imageError, setImageError] = useState(false);

  // set the header title when the details are loaded
  useEffect(() => {
    spDetails
      ? navigation.setOptions({ title: spDetails?.name })
      : navigation.setOptions({ title: "" });
  }, [spDetails]);

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {isSpLoading ? (
        <Center width="100%" height="100%">
          <Spinner size="lg" />
        </Center>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* image */}
          <Center> 
            <MEImage
              source={{
                uri: spDetails.logo?.url,
              }}
              resizeMode="contain"
              alt="service provider's image"
              w="full"
              h="200"
              py="20" px="5"
              altComponent={<></>}
            />
          </Center>

          {/* content */}
          <Box
            backgroundColor="white"
            px="5"
            pt="5"
            pb="20"
            borderTopRadius="2xl"
          >

            <Heading size="xl" mb="5">
              {spDetails.name}
            </Heading>

            {/* Description */}
            <Box mb="5">
              <Text fontSize="lg" fontWeight="bold">
                Description
              </Text>
              {spDetails.description && (
                <HTMLParser
                  htmlString={spDetails.description}
                  baseStyle={{ fontSize: "16px" }}
                />
              )}
            </Box>

            {/* Contact Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Contact Information
              </Text>
              <VStack space="2" mt="2">
                <HStack space="5">
                  <Icon as={FontAwesome} name="phone" size="sm" />
                  <Text>{spDetails.phone_number || "N/A"}</Text>
                </HStack>
                <HStack space="5">
                  <Icon as={FontAwesome} name="envelope" size="sm" />
                  <Link isUnderlined={false}>{spDetails.email || "N/A"}</Link>
                </HStack>
                <HStack space="5">
                  <Icon as={FontAwesome} name="globe" size="sm" />
                  <Link _text={{ color: "primary.400" }}>
                    {spDetails.website || "N/A"}
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      )}
    </View>
  );
}
