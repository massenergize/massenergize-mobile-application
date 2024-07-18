/******************************************************************************
 *                            ChangePasswordModal
 * 
 *      Displays a modal that allows the user to change their password.
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
  Modal, 
  FormControl, 
  Input, 
  Text, 
  Button, 
  ScrollView,
  View,
} from "@gluestack-ui/themed-native-base";
import { showError, showSuccess } from "../../../utils/common";
import { connect } from "react-redux";
import { reauthnticateWithEmail } from "../../../config/firebase";
import {
  Platform,
  KeyboardAvoidingView
} from 'react-native';

/* 
 * This serves as a validation schema to prevent the user to change their
 * password unless all the required fields are filled. 
 */
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordModal = ({ isOpen, setIsOpen, fireAuth }) => {
  /* 
   * Uses local state to determine whether the user has clicked on the 
   * 'Submit' button and is submitting his new email address. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Function to handle form submission */
  const handleSubmit = (values) => {
    setIsSubmitting(true);

    /* Reauthenticate user with their current email and password */
    reauthnticateWithEmail(fireAuth.email, values.oldPassword)
      .then(() => {

        /* Update the user's password in Firebase */
        fireAuth.updatePassword(values.newPassword)
          .then(() => {
            console.log("Password updated successfully");
            showSuccess("Password updated successfully");
            setIsOpen(false);
          })
          .catch(error => {
            console.error("Error updating password:", error);
            showError("Failed to update password. Please try again later.");
          })
      })
      .catch(error => {
        console.error("Error reauthenticating user:", error);
        showError("Failed to reauthenticate user. \
          Are you sure you entered the correct password?");
      })
      .finally(() => setIsSubmitting(false));
  };

  /* Displays the Change Password Modal */
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? 'padding' : 'height'}
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
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
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
                  <Modal.Header>Change Password</Modal.Header>

                  {/* Modal Body */}
                  <Modal.Body>
                    <FormControl>

                      {/* Old Password */}
                      <FormControl.Label>Old Password</FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        onChangeText={handleChange("oldPassword")}
                        onBlur={handleBlur("oldPassword")}
                        value={values.oldPassword}
                        placeholder="Old Password"
                        type="password"
                        isInvalid={touched.oldPassword && errors.oldPassword}
                      />
                      {touched.oldPassword && errors.oldPassword && (
                        <Text color="red.500">{errors.oldPassword}</Text>
                      )}
                    </FormControl>

                    {/* New Password */}
                    <FormControl mt={3}>
                      <FormControl.Label>New Password</FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        onChangeText={handleChange("newPassword")}
                        onBlur={handleBlur("newPassword")}
                        value={values.newPassword}
                        placeholder="New Password"
                        type="password"
                        isInvalid={touched.newPassword && errors.newPassword}
                      />
                      {touched.newPassword && errors.newPassword && (
                        <Text color="red.500">{errors.newPassword}</Text>
                      )}
                    </FormControl>
                    
                    {/* Confirm Password */}
                    <FormControl mt={3}>
                      <FormControl.Label>Confirm Password</FormControl.Label>
                      <Input
                        variant="rounded"
                        size="lg"
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        placeholder="Confirm Password"
                        type="password"
                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text color="red.500">{errors.confirmPassword}</Text>
                      )}
                    </FormControl>
                  </Modal.Body>

                  {/* Footer */}
                  <Modal.Footer>
                    <Button.Group>
                      {/* Close Button */}
                      <Button
                        variant="ghost"
                        _text={{ color: "muted.400" }}
                        onPress={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>

                      {/* Submit Button */}
                      <Button
                        isLoading={isSubmitting}
                        isLoadingText="Updating..."
                        onPress={handleSubmit}
                      >
                        Update
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
 * ChangePasswordModal function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    fireAuth: state.fireAuth
  };
};

export default connect(mapStateToProps)(ChangePasswordModal);
