/******************************************************************************
 *                            DeleteAccountModal
 * 
 *      This component is a modal that allows the user to delete their account.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 18, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import { 
  Modal, 
  Text, 
  Button, 
  FormControl, 
  Input,
  View,
  ScrollView
} from "@gluestack-ui/themed-native-base";
import { Alert } from "react-native";
import { connect } from "react-redux";
import { 
  hasProvider, 
  showError, 
  showSuccess 
} from "../../../utils/common";
import { deleteUserAction } from "../../../config/redux/actions";
import { bindActionCreators } from "redux";
import { 
  reauthenticateWithGoogle, 
  reauthnticateWithEmail 
} from "../../../config/firebase";
import {
  Platform,
  KeyboardAvoidingView
} from 'react-native';

const DeleteAccountModal = ({
  isOpen,
  setIsOpen,
  fireAuth,
  user,
  navigation,
  deleteUserAction
}) => {
  /* 
   * Uses local state to determine whether the user has clicked on the 
   * 'Submit' button and is submitting his new email address, also saves
   * the entered password to confirm that the user surely wants to 
   * delete their account and an error message in case something goes
   * wrong in the action of deleting their account. 
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  /* Function to delete the user's account */
  const deleteUser = () => {
    setIsSubmitting(true);

    deleteUserAction(user?.id, (response, error) => {
      if (error) {
        showError(
          "An error occurred while deleting your account. Please try again."
        );
        console.error("Error deleting user account:", error);
        return;
      }
      showSuccess("Your account has been deleted successfully.");
      navigation.navigate("Community");
    });
  };

  /* Function to confirm password and confirm deletion */
  const handleDelete = () => {
    setIsSubmitting(true);

    const reauthenticateFunction = hasProvider(fireAuth, "google.com")
      ? reauthenticateWithGoogle
      : reauthnticateWithEmail;

    reauthenticateFunction(fireAuth.email, password)
      .then(() => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account? This action cannot be undone.",
          [
            { 
              text: "Cancel", 
              style: "cancel" 
            },
            { 
              text: "Delete", 
              style: "destructive", 
              onPress: () => deleteUser() 
            },
          ]
        );
      })
      .catch((error) => {
        console.error("Error reauthenticating user:", error);
        showError("Incorrect password. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  /* Displays the Delete Account Modal */
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
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 300,
              alignSelf: 'center'
            }}
          >
            <Modal.Content style={{ width: 300, alignSelf: 'center' }}>
              {/* Close Button */}
              <Modal.CloseButton />

              {/* Header */}
              <Modal.Header>Delete My Account</Modal.Header>

              {/* Modal Body */}
              <Modal.Body>
                {/* Displays user's current email */}
                <Text fontWeight="300">
                  The current email associated with your account is{" "}
                  <Text 
                    color="secondary.400" 
                    fontWeight="bold" 
                    fontSize="sm"
                  >
                    {user?.email}
                  </Text>
                </Text>

                {/* Identity confirmation */}
                {hasProvider(fireAuth, "google.com") ? (
                  <Text my="5" fontWeight="bold">
                    You are currently signed in with Google. 
                    Confirm your identity.
                  </Text>
                ) : (
                  /* Enter Password to Confirm */
                  <FormControl my="5">
                    <FormControl.Label>
                      {" "}
                      Enter your password to confirm{" "}
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      size="lg"
                      onChangeText={(text) => setPassword(text)}
                      value={password}
                      placeholder="Password"
                      type="password"
                      isInvalid={errorMessage}
                    />
                    {errorMessage && <Text color="red.500">{errorMessage}</Text>}
                  </FormControl>
                )}

                <Text fontWeight="300" fontSize="md">
                  Are you sure you want to delete your account? This action cannot be
                  undone.
                </Text>
              </Modal.Body>

              {/* Footer */}
              <Modal.Footer>
                <Button.Group>
                  {/* Cancel Button */}
                  <Button variant="ghost" onPress={() => setIsOpen(false)}>
                    Cancel
                  </Button>

                  {/* Submit Button */}
                  <Button
                    colorScheme="danger"
                    isLoading={isSubmitting}
                    isLoadingText="Deleting..."
                    onPress={handleDelete}
                  >
                    Delete
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* 
 * Transforms the local state of the app into the properties of the 
 * DeleteAccountModal function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    fireAuth: state.fireAuth,
    user: state.user,
  };
};

/* 
 * Transforms the dispatch function from the API in order to get the information
 * of the current community and sends it to the DeleteAccountModal properties.
 */
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ deleteUserAction }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountModal);
