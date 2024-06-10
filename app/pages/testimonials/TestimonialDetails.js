/******************************************************************************
 *                            TestimonialDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single testimonial.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 10, 2023 (by Moizes Almeida)
 * 
 *****************************************************************************/


import React from "react";
import Moment from 'moment';
import { VStack, Image, Text, Spinner, Center } from "@gluestack-ui/themed-native-base";
import { ScrollView, View, useWindowDimensions } from "react-native";

import ActionCard from "../actions/ActionCard.js";
import ServiceProviderCard from "../service-providers/ServiceProviderCard.js";
import HTMLParser from "../../utils/HTMLParser.js";
import { useDetails } from "../../utils/hooks.js";
import { getActionMetric } from "../../utils/common.js";
import { connect } from "react-redux";
import MEImage from "../../components/image/MEImage.js";

function TestimonialDetails({ route, navigation, vendorsSettings }) {
  const { width } = useWindowDimensions();

  const { testimonial_id } = route.params;
  const [testimonial, isTestimonialLoading]
    = useDetails("testimonials.info", { testimonial_id: testimonial_id });

  console.log("testimonial: ", testimonial);

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        isTestimonialLoading
          ? (
            // Loading spinner
            <Center width="100%" height="100%">
              <Spinner size="lg" />
            </Center>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack bg="white" px="3" pb="20">

                {/* Image */}
                <MEImage
                  source={{
                    uri: testimonial.file?.url
                  }}
                  my={3}
                  h={250}
                  w={width}
                  alt="image"
                  resizeMode="contain"
                />

                {/* Header */}
                <Text bold fontSize="2xl" mt={3}>{testimonial.title}</Text>
                <Text fontSize="md" color="#BAB9C0" mb={3}>By {testimonial.preferred_name} | {Moment(testimonial.created_at).format('ll')}</Text>

                {/* Body */}
                <HTMLParser
                  htmlString={testimonial.body}
                  baseStyle={textStyle} />

                {/* Associated action */}
                {
                  testimonial.action != null
                    ? (
                      <View>
                        <Text bold fontSize="lg" mb={3} mt={5}>Associated Action</Text>
                        <ActionCard
                          navigation={navigation}
                          id={testimonial.action?.id}
                          title={testimonial.action?.title}
                          imgUrl={testimonial.file?.url}
                          impactMetric={getActionMetric(testimonial.action, "Impact")}
                          costMetric={getActionMetric(testimonial.action, "Cost")}
                        />
                      </View>
                    ) : <></>
                }

                {/* Associated vendor */}
                {
                  (vendorsSettings.is_published && testimonial.vendor != null)
                    ? (
                      <View>
                        <Text bold fontSize="lg" mb={2} mt={7}>Related Vendor</Text>
                        <ServiceProviderCard
                          id={testimonial.vendor.id}
                          direction="row"
                          name={testimonial.vendor.name}
                          description="This could be a brief description of the service provider."
                          imageURI={(testimonial.vendor.logo) ? testimonial.vendor.logo.url : null}
                          // onPress={() => navigation.navigate("serviceProviderDetails")}
                          navigation={navigation}
                          my="2"
                        />
                      </View>
                    ) : <></>
                }
              </VStack>
            </ScrollView>
          )
      }
    </View>
  );
}

const textStyle = {
  fontSize: "16px",
};

const mapStateToProps = state => {
  return {
    vendorsSettings: state.vendorsPage
  }
};

export default connect(mapStateToProps)(TestimonialDetails);