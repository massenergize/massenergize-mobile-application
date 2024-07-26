/******************************************************************************
 *                            ServiceProviderDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single service provider.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 26, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useEffect, useState } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { useDetails } from "../../utils/hooks";
import Share from 'react-native-share';
import { 
  Box, 
  Center, 
  Heading, 
  HStack, 
  Icon, 
  Link, 
  ScrollView, 
  Spinner, 
  Text, 
  VStack,
  View
} from "@gluestack-ui/themed-native-base";
import MEImage from "../../components/image/MEImage";
import HTMLParser from "../../utils/HTMLParser";
import { FontAwesomeIcon } from "../../components/icons";

export default function ServiceProviderDetails({ route, navigation }) {
  /* Saves the vendor id passed through the route's parameters */
  const { vendor_id } = route.params;

  /* Search for the vendor's information in the API */
  const [spDetails, isSpLoading] = useDetails("vendors.info", {
    vendor_id: vendor_id,
  });

  /* 
   * Function that handles adding the web protocol to a link 
   * if it doesn't include one.
   */
  const addHttp = (url) => {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      return "http://" + url;
    }
    return url;
  };

  /* 
   * Function that handles the action of pressing on the phone number 
   * of the vendor displayed in the page.
   */
  const handlePhonePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  /* 
   * Function that handles sending an email to the service provider
   * when the user presses on the email icon displayed in the page.
   */
  const handleEmailPress = async (email) => {
    try {
      await Share.open({
        title: 'Contact Service Provider',
        message: 'Hi, I would like to contact you regarding your services.',
        failOnCancel: false,
        social: Share.Social.EMAIL,
        email: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* Sets the Page title to be the name of the service provider */
  useEffect(() => {
    spDetails
      ? navigation.setOptions({ title: spDetails?.name })
      : navigation.setOptions({ title: "" });
  }, [spDetails]);

  /* Displays the Service Provider information to the page */
  return (
    <View
      height="100%"
      bg="white"
    >
      {/* If the information is being searched, display a spinner */}
      {isSpLoading ? (
        <Center
          width="100%"
          height="100%"
        >
          <Spinner size="lg" />
        </Center>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <Center>
            <MEImage
              source={{
                uri: spDetails.logo?.url
              }}
              resizeMode="contain"
              alt="service provider's image"
              w="full"
              h="200"
              py="20"
              px="5"
              altComponent={<></>}
            />
          </Center>

          {/* Content */}
          <Box
            bg="white"
            px="5"
            pt="5"
            pb="20"
            borderTopRadius="2xl"
          >
            {/* Vendor's name */}
            <Heading
              size="xl"
              mb="5"
            >
              {spDetails.name}
            </Heading>

            {/* Description */}
            {spDetails.description !== "" && (
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Description
                </Text>
                {spDetails.description && (
                  <HTMLParser
                    htmlString={spDetails.description}
                    baseStyle={{ fontSize: "16px" }}
                  />
                )}
              </Box>
            )}

            {/* Contact Information */}
            <Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
              >
                Contact Information
              </Text>
              
              {/* Phone number */}
              <VStack
                space="2"
                mt="2"
              >
                <TouchableOpacity
                  onPress={() => handlePhonePress(spDetails.phone_number)}
                >
                  <HStack
                    space="5"
                    alignItems="center"
                  >
                    <Icon 
                      as={FontAwesomeIcon} 
                      name="phone"
                      size="sm"
                      color="blue.400"
                    />

                    <Text>{spDetails.phone_number || "N/A"}</Text>
                  </HStack>
                </TouchableOpacity>
                
                {/* Email */}
                <TouchableOpacity
                  onPress={() => handleEmailPress(spDetails.email)}
                >
                  <HStack
                    space="5"
                    alignItems="center"
                  >
                    <Icon 
                      as={FontAwesomeIcon} 
                      name="envelope"
                      size="sm"
                      color="yellow.400"
                    />

                    <Link isUnderlined={false}>{spDetails.email || "N/A"}</Link>
                  </HStack>
                </TouchableOpacity>
                
                {/* Website */}
                {
                  spDetails.website && (
                    <HStack
                      space="5"
                      alignItems="center"
                    >
                      <Icon
                        as={FontAwesomeIcon}
                        name="globe"
                        size="sm"
                        color="green.400"
                      />

                      <Link
                        _text={{
                          color: "primary.400"
                        }}
                        href={addHttp(spDetails.website)}
                      >
                        {spDetails.website}
                      </Link>
                    </HStack>
                  )
                }
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      )}
    </View>
  );
}