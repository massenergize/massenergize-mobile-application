/******************************************************************************
 *                            TestimonialDetails
 * 
 *      This page is responsible for rendering detailed information about a
 *      single testimonial.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React from "react";
import Moment from 'moment';
import {
  VStack,
  Text,
  Spinner,
  Center,
  Badge
} from "@gluestack-ui/themed-native-base";
import { Alert, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import ActionCard from "../actions/ActionCard.js";
import ServiceProviderCard from "../service-providers/ServiceProviderCard.js";
import HTMLParser from "../../utils/HTMLParser.js";
import { useDetails } from "../../utils/hooks.js";
import { getActionMetric, showError, showSuccess } from "../../utils/common.js";
import { connect } from "react-redux";
import MEImage from "../../components/image/MEImage.js";
import { IonicIcon } from "../../components/icons/index.js";
import { COLOR_SCHEME } from "../../stylesheet/index.js";
import { apiCall } from "../../api/functions.js";
import { removeTestimonialAction } from "../../config/redux/actions.js";
import { bindActionCreators } from "redux";

function TestimonialDetails({
  route,
  navigation,
  vendorsSettings,
  actions,
  removeTestimonial
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
  const testimonialAction = actions?.find(
    action => testimonial?.action &&
      action.id === testimonial.action.id
  );

  /* Opens the AddTestimonial page in edit mode */
  const editTestimonial = () => {
    navigation.navigate("AddTestimonial", {
      testimonial: testimonial,
      editMode: true
    });
  };

  /* Deletes the testimonial */
  const deleteTestimonial = () => {
    const doDeletion = () => {
      apiCall("testimonials.delete", { testimonial_id: testimonial.id })
        .then((response) => {
          console.log(response);
          removeTestimonial(testimonial.id);
          showSuccess("Testimonial deleted successfully.");
          navigation.goBack();
        })
        .catch((error) => {
          console.error(error);
          showError("Error deleting testimonial. Please try again.");
        });
    }

    Alert.alert(
      "Delete Testimonial",
      "Are you sure you want to delete this testimonial?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: doDeletion
        }
      ]
    );
  };

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

                {/* For pending testimonials */}
                {testimonial.is_approved === false && (
                  <View
                    width="100%"
                    style={{
                      marginTop: 40,
                    }}
                  >
                    <Text
                      colorScheme="red"
                      style={{
                        backgroundColor: '#DC4E34',
                        color: 'white',
                        padding: 5,
                        textAlign: 'center',
                        marginHorizontal: 40,
                      }}
                    >
                      Pending Approval
                    </Text>

                    {/* Edit button */}
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 10,
                      }}
                      onPress={editTestimonial}
                    >
                      <IonicIcon
                        name="pencil"
                        size={20}
                        color={COLOR_SCHEME.GREEN}
                      />
                      <Text
                        color={COLOR_SCHEME.GREEN}
                        ml={2}
                      >
                        Edit Testimonial
                      </Text>
                    </Pressable>

                    {/* Delete button - edit: turns out you can't delete currently? oh well */}
                    {/* <Pressable
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 10,
                      }}
                      onPress={deleteTestimonial}
                    >
                      <IonicIcon
                        name="trash"
                        size={20}
                        color="#DC4E34"
                      />
                      <Text
                        color="#DC4E34"
                        ml={2}
                      >
                        Delete Testimonial
                      </Text>
                    </Pressable> */}

                  </View>
                )}


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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    removeTestimonial: removeTestimonialAction
}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestimonialDetails);