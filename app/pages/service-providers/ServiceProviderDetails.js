/******************************************************************************
 *                            ServiceProviderDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single service provider.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 2, 2024
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
import { FontAwesomeIcon } from "../../components/icons";
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

  const addHttp = (url) => {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      return "http://" + url;
    }
    return url;
  }

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
                <HStack space="5" alignItems="center">
                  <Icon 
                    as={FontAwesomeIcon} 
                    name="phone" 
                    size="sm" 
                    color="blue.400" 
                  />

                  <Text>{spDetails.phone_number || "N/A"}</Text>
                </HStack>

                <HStack space="5" alignItems="center">
                  <Icon 
                    as={FontAwesomeIcon} 
                    name="envelope" 
                    size="sm" 
                    color="yellow.400"
                  />

                  <Link isUnderlined={false}>{spDetails.email || "N/A"}</Link>
                </HStack>
                
                {spDetails.website &&
                  <HStack space="5" alignItems="center">
                    <Icon 
                      as={FontAwesomeIcon} 
                      name="globe" 
                      size="sm" 
                      color="green.400"
                    />

                    <Link 
                      _text={{ color: "primary.400" }} 
                      href={addHttp(spDetails.website)}
                    >
                      {spDetails.website}
                    </Link>
                  </HStack>
                }
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      )}
    </View>
  );
}
