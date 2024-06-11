/******************************************************************************
 *                            ChangePasswordModal
 * 
 *      Displays a modal that allows the user to change their password
 * 
 *      Written by: William Soylemez
 *      Last edited: June 10, 2023
 * 
 *****************************************************************************/

import React, { useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import { Modal, FormControl, Input, Text, Button } from "@gluestack-ui/themed-native-base";
import { showError, showSuccess } from "../../../utils/common";
import { connect } from "react-redux";

import auth from '@react-native-firebase/auth';
import { reauthnticateWithEmail } from "../../../config/firebase";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordModal = ({ isOpen, setIsOpen, fireAuth }) => {
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

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />

            {/* Header */}
            <Modal.Header>Change My Password</Modal.Header>
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
              <FormControl>
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
              <FormControl>
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
                <Button
                  variant="ghost"
                  _text={{ color: "muted.400" }}
                  onPress={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
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
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    fireAuth: state.fireAuth
  };
};

export default connect(mapStateToProps)(ChangePasswordModal);
