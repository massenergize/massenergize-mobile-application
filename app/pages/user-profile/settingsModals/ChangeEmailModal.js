/******************************************************************************
 *                            ChangeEmailModal
 * 
 *      This page allows the user to change their email address. It requires
 *      the user to enter their current password to confirm the change.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 11, 2024
 * 
 *****************************************************************************/

import React, { useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Modal, FormControl, Input, Text } from "@gluestack-ui/themed-native-base";
import { connect } from "react-redux";
import { reauthnticateWithEmail } from "../../../config/firebase";
import { showError, showSuccess } from "../../../utils/common";
import auth from "@react-native-firebase/auth";
import { updateUserAction } from "../../../config/redux/actions";

const validationSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email("Please enter a valid email")
    .required("New email is required"),
  password: Yup.string().required("Password is required"),
});

const ChangeEmailModal = ({ isOpen, setIsOpen, user }) => {
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
                showSuccess("Email updated successfully. Please verify your new email address.");
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


  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
          <Modal.Content maxWidth="400">
            <Modal.CloseButton />

            {/* Header */}
            <Modal.Header>Change My Email</Modal.Header>
            <Modal.Body>
              <Text style={{ fontSize: 16 }}>Current email</Text>
              <Text pb={5}>{user?.email}</Text>
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
              <FormControl>
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
                <Button
                  variant="ghost"
                  _text={{ color: "muted.400" }}
                  onPress={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
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
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChangeEmailModal);
