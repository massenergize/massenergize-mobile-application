import React, { useState } from "react";
import { Modal, Text, Button, FormControl, Input } from "@gluestack-ui/themed-native-base";
import { Alert } from "react-native";
import { connect } from "react-redux";
import { hasProvider, showError, showSuccess, updateUser } from "../../../utils/common";
import auth from "@react-native-firebase/auth";
import { deleteUserAction } from "../../../config/redux/actions";
import { bindActionCreators } from "redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DeleteAccountModal = ({
  isOpen,
  setIsOpen,
  fireAuth,
  user,
  navigation,
  deleteUserAction
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const reauthnticateWithEmail = () => {
    const credential = auth.EmailAuthProvider.credential(fireAuth.email, password);
    return fireAuth.reauthenticateWithCredential(credential);
  };

  const reauthenticateWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);

    return fireAuth.reauthenticateWithCredential(credential);
  };


  const deleteUser = () => {
    setIsSubmitting(true);
    deleteUserAction(user?.id, (response, error) => {
      if (error) {
        showError("An error occurred while deleting your account. Please try again.");
        return;
      }
      showSuccess("Your account has been deleted successfully.");
      console.log("NAVIGATIONSNSNS??");
      navigation.navigate("Community");
    });

  };

  const handleDelete = () => {
    setIsSubmitting(true);

    const reauthenticateFunction = hasProvider(fireAuth, "google.com")
      ? reauthenticateWithGoogle
      : reauthnticateWithEmail;

    reauthenticateFunction()
      .then(() => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account? This action cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteUser() },
          ]
        );
      })
      .catch((error) => {
        console.error("Error reauthenticating user:", error);
        showError("Incorrect password. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Delete My Account</Modal.Header>
        <Modal.Body>
          <Text>
            The current email associated with your account is{" "}
            <Text color="secondary.400" fontWeight="bold" fontSize="sm">
              {user?.email}
            </Text>
          </Text>
          {hasProvider(fireAuth, "google.com") ? (
            <Text my="5" fontWeight="bold">
              You are currently signed in with Google. Confirm your identity.
            </Text>
          ) : (
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
          <Text>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button variant="ghost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
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
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    fireAuth: state.fireAuth,
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ deleteUserAction }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountModal);
