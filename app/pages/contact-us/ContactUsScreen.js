/******************************************************************************
 *                            ContactUsScreen
 * 
 *      This page is responsible for rendering the Contact Us page
 *      of the community.
 * 
 *      Written by: Moizes Almeida
 *      Last edited: July 15, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import { KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import {
  Text,
  View,
  FormControl,
  Input,
  VStack,
  ScrollView,
  Divider,
  Button,
  Modal,
  Center,
  Icon
} from '@gluestack-ui/themed-native-base';
import { FontAwesomeIcon } from '../../components/icons';
import * as Yup from "yup";
import { Formik } from 'formik';
import { apiCall } from '../../api/functions';
import { fetchAllUserInfo } from '../../config/redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* 
 * This serves as a validation schema to prevent the user to send a 
 * message to the community's administrator if all the required fields 
 * are not filled. 
 */
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

function ContactUsScreen({
  communityInfo,
  user,
  navigation
}) {
  /* Saves the community's ID into a variable */
  const community_id = communityInfo.id;

  /* 
   * Uses local state to determine if the message the user is sending
   * to the community's administrator is in the process to being sent 
   * or if it was already sent. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /* 
   * Function that handles the action of the user of clicking in the
   * 'Send Message' button.
   */
  const handleSendMessage = (values, actions) => {
    setIsSubmitting(true);
    const data = {
      community_id: community_id,
      name: values.name,
      email: values.email,
      title: values.subject,
      body: values.message,
    };

    apiCall("admins.messages.add", data).then((response) => {
      setIsSubmitting(false);
      if (response.success && response.data) {
        setIsSent(true);
      } else {
        console.log("Error sending message", response);
      }
    });

    actions.resetForm();
  };

  /* Exit modal and go back */
  const exitModal = () => {
    setIsSent(false);
    navigation.goBack();
  };

  /* Displays the Contact Us page of the community */
  return (
    <View bg="white" height="100%">
      <ScrollView
        showsVerticalScrollIndicator={false}
        px={5}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <VStack>
            <Text bold fontSize="md" mt={5}>
              Community Administrator
            </Text>
            <Text fontSize="sm">
              {communityInfo.owner_name}
            </Text>
            {communityInfo.location?.city ? (
              <View>
                <Text bold fontSize="md" mt={3}>
                  Location
                </Text>
                <Text fontSize="sm">
                  {communityInfo.location.city},
                  Massachusetts,{" "}
                  {communityInfo.location.zipcode}
                </Text>
              </View>
            ) : null}
            <Divider my={5} />
            <Text textAlign="center" fontSize="sm">
              We are always striving to make this better and welcome your
              feedback! Reach the community administrator by filling in the
              form.
            </Text>
            <Formik
              initialValues={{
                name: user?.full_name,
                email: user?.email,
                subject: "",
                message: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSendMessage}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <VStack>
                  <FormControl
                    mt={5}
                    isRequired
                    isInvalid={errors.name && touched.name}
                  >
                    <Input
                      variant="rounded"
                      size="lg"
                      placeholder="Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />
                    {
                      errors.name && touched.name ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.name}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <FormControl
                    mt={3}
                    isRequired
                    isInvalid={errors.email && touched.email}
                  >
                    <Input
                      variant="rounded"
                      size="lg"
                      placeholder="Email"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                    {
                      errors.email && touched.email ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.email}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <FormControl
                    mt={3}
                    isRequired
                    isInvalid={errors.subject && touched.subject}
                  >
                    <Input
                      variant="rounded"
                      size="lg"
                      placeholder="Subject"
                      onChangeText={handleChange("subject")}
                      onBlur={handleBlur("subject")}
                      value={values.subject}
                    />
                    {
                      errors.subject && touched.subject ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.subject}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <FormControl
                    mt={3}
                    isRequired
                    isInvalid={errors.message && touched.message}
                  >
                    <Input
                      size="lg"
                      borderRadius={25}
                      placeholder="Message"
                      textAlignVertical="top"
                      multiline={true}
                      height={40}
                      onChangeText={handleChange("message")}
                      onBlur={handleBlur("message")}
                      value={values.message}
                    />
                    {
                      errors.message && touched.message ? (
                        <FormControl.ErrorMessage
                          _text={{
                            fontSize: "xs",
                            color: "error.500",
                            fontWeight: 500,
                          }}
                        >
                          {errors.message}
                        </FormControl.ErrorMessage>
                      ) : null
                    }
                  </FormControl>
                  <Button
                    width="50%"
                    alignSelf="flex-end"
                    mt={5}
                    bg="primary.400"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    Send Message
                  </Button>
                </VStack>
              )}
            </Formik>
          </VStack>

          {/* Modal for congratulating after message is sent successfully */}
          <Modal isOpen={isSent} onClose={() => setIsSent(false)}>
            <Modal.Content maxWidth={400}>
              <Modal.Body>
                <Center mb="5">
                    <FontAwesomeIcon
                      name="paper-plane"
                      size={90}
                      color="green"
                    />
                    <Text fontSize="lg" fontWeight="bold" py="5">
                      Message Sent!
                    </Text>
                    <Text textAlign="center">
                      The admin team will get in touch with you soon!
                    </Text>
                </Center>
                <Button colorScheme={"gray"} onPress={exitModal}>
                    Back
                </Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

/* 
 * Transforms the local state of the app into the properties of the 
 * ContactUsScreen function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    communityInfo: state.communityInfo,
    user: state.user,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the ContactUsScreen properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchAllUserInfo: fetchAllUserInfo,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsScreen);
