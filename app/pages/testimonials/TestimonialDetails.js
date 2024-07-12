/******************************************************************************
 *                            TestimonialDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single testimonial.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 12, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import Moment from 'moment';
import { 
  VStack, 
  Text, 
  Spinner, 
  Center 
} from "@gluestack-ui/themed-native-base";
import { ScrollView, View, useWindowDimensions } from "react-native";
import ActionCard from "../actions/ActionCard.js";
import ServiceProviderCard from "../service-providers/ServiceProviderCard.js";
import HTMLParser from "../../utils/HTMLParser.js";
import { useDetails } from "../../utils/hooks.js";
import { getActionMetric } from "../../utils/common.js";
import { connect } from "react-redux";
import MEImage from "../../components/image/MEImage.js";

function TestimonialDetails({ 
  route, 
  navigation, 
  vendorsSettings, 
  actions 
}) {
  /* Gets the dimensions of the user's phone */
  const { width } = useWindowDimensions();

  /* Retrieves the testimonial from the route in which this page was called */
  const { testimonial_id } = route.params;

  /* 
   * Uses the testimonial id to retrieve the information about the 
   * testimonial from the API.
   */
  const [testimonial, isTestimonialLoading] = useDetails(
    "testimonials.info", 
    { testimonial_id: testimonial_id }
  );

  /* Retrieved the information about the associated action of the testiminal */
  const testimonialAction = actions.find(
    action => testimonial?.action && 
    action.id === testimonial.action.id
  );

  /* Displays the testimonial information in the page */
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {
        isTestimonialLoading
          ? (
            /* Loading spinner */
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
                <Text fontSize="md" color="#BAB9C0" mb={3}>
                  {/* If there's no author, display it as Anonymous */}
                  By {testimonial.preferred_name || 'Anonymous'} | {""}
                     {Moment(testimonial.created_at).format('ll')}
                </Text>

                {/* Body */}
                <HTMLParser
                  htmlString={testimonial.body}
                  baseStyle={textStyle} />

                {/* Associated action */}
                {
                  testimonialAction
                    ? (
                      <View>
                        <Text 
                          bold 
                          fontSize="lg" 
                          mb={3} 
                          mt={5}
                        >
                          Associated Action
                        </Text>

                        <ActionCard
                          navigation={navigation}
                          id={testimonialAction.id}
                          title={testimonialAction.title}
                          imgUrl={testimonialAction.image?.url}
                          impactMetric={
                            getActionMetric(testimonialAction, "Impact")
                          }
                          costMetric={
                            getActionMetric(testimonialAction, "Cost")
                          }
                        />
                      </View>
                    ) : <></>
                }

                {/* Associated vendor */}
                {
                  (vendorsSettings.is_published && 
                    testimonial.vendor != null)
                    ? (
                      <View>
                        <Text 
                          bold 
                          fontSize="lg"
                          mb={2} 
                          mt={7}
                        >
                          Related Vendor
                        </Text>

                        <ServiceProviderCard
                          id={testimonial.vendor.id}
                          direction="row"
                          name={testimonial.vendor.name}
                          description="Description of the service provider."
                          imageURI={
                            (testimonial.vendor.logo) 
                              ? testimonial.vendor.logo.url 
                              : null
                          }
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

/* 
 * Transforms the local state of the app into the proprieties of the 
 * TestimonialsDetails function, in which it is got from the API.
 */
const mapStateToProps = state => {
  return {
    vendorsSettings: state.vendorsPage,
    actions: state.actions
  }
};

export default connect(mapStateToProps)(TestimonialDetails);