/******************************************************************************
 *                            ChangeEmailModal
 * 
 *      This page allows the user to change their email address. It requires
 *      the user to enter their current password to confirm the change.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { 
  Button, 
  Modal, 
  FormControl, 
  Input, 
  Text, 
  ScrollView,
  View,
} from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import { reauthnticateWithEmail } from "../../../config/firebase";
import { showError, showSuccess } from "../../../utils/common";
import auth from "@react-native-firebase/auth";
import { updateUserAction } from "../../../config/redux/actions";
import {
  KeyboardAvoidingView,
  Platform
} from 'react-native';

/* 
 * This serves as a validation schema to prevent the user to change their
 * email address unless all the required fields are filled. 
 */
const validationSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email("Please enter a valid email")
    .required("New email is required"),
  password: Yup.string().required("Password is required"),
});

const ChangeEmailModal = ({ isOpen, setIsOpen, user }) => {
  /* 
   * Uses local state to determine whether the user has clicked on the 
   * 'Submit' button and is submitting his new email address. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Function to handle form submission */
  const handleSubmit = (values) => {
    setIsSubmitting(true);

    /* Reauthenticate user with their current email and password */
    reauthnticateWithEmail(user.email, values.password)
      .then(() => {

        /* Update the user's email in Firebase */
        auth().currentUser.updateEmail(values.newEmail)
          .then(() => {

            /* Send email verification to the new email */
            auth().currentUser.sendEmailVerification();

            /* Update the user's email in the database */
            updateUserAction(
              "users.update",
              { user_id: user.id, email: values.newEmail },
              (response, error) => {
                if (error) {
                  console.error("Error updating email:", error);
                  showError("Failed to update email. Please try again later.");
                  setIsSubmitting(false);
                  return;
                }
                console.log("Email updated successfully");
                showSuccess(
                  "Email updated successfully. Please verify your new email address."
                );
                setIsOpen(false);
              });
          });
      })
      .catch((error) => {
        console.error("Error reauthenticating user:", error);
        showError("Failed to reauthenticate user. \
          Are you sure you entered the correct password?");
      })
      .finally(() => setIsSubmitting(false));
  }

  /* Display the Change Email Modal */
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center' 
          }}
        >
          <View style={{ width: 300, alignSelf: 'center' }}>
            <Formik
              initialValues={{ newEmail: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <Modal.Content 
                  style={{ width: 300 }} 
                  alignSelf="center"
                >
                  {/* Close Button */}
                  <Modal.CloseButton />

                  {/* Header */}
                  <Modal.Header>Change My Email</Modal.Header>

                  {/* Modal Body */}
                  <Modal.Body>
                    {/* Displays user's current email */}
                    <Text fontSize="lg">Current email:</Text>
                    <Text 
                      pb={5} 
                      fontSize="sm" 
                      fontWeight="300"
                    >
                      {user?.email}
                    </Text>

                    <FormControl>
                      {/* New Email */}
                      <FormControl.Label>New Email</FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        onChangeText={handleChange("newEmail")}
                        onBlur={handleBlur("newEmail")}
                        value={values.newEmail}
                        placeholder="New Email"
                      />
                      {errors.newEmail && touched.newEmail && (
                        <Text color="red.500">{errors.newEmail}</Text>
                      )}
                    </FormControl>

                    {/* Enter Password */}
                    <FormControl mt={3}>
                      <FormControl.Label>Current Password</FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        placeholder="Password"
                        type="password"
                      />
                      {errors.password && touched.password && (
                        <Text color="red.500">{errors.password}</Text>
                      )}
                    </FormControl>
                  </Modal.Body>

                  {/* Footer */}
                  <Modal.Footer>
                    <Button.Group>
                      {/* Cancel Button */}
                      <Button
                        variant="ghost"
                        _text={{ color: "muted.400" }}
                        onPress={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      
                      {/* Submit button */}
                      <Button
                        isLoading={isSubmitting}
                        isLoadingText="Saving..."
                        onPress={handleSubmit}
                      >
                        Save
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* 
 * Transforms the local state of the app into the properties of the 
 * ChangeEmailModal function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChangeEmailModal);
