/******************************************************************************
 *                            EditProfileModal
 * 
 *      Displays a modal that allows the user to edit their profile.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import React, { useState } from "react";
import { Modal, FormControl, Input, VStack, Button } from "@gluestack-ui/themed-native-base";
import { showError, updateUser } from "../../../utils/common";
import { connect } from "react-redux";

const EditProfileModal = ({ isOpen, setIsOpen, user }) => {
  const [fullName, setFullName] = useState(user?.full_name);
  const [preferredName, setPreferredName] = useState(user?.preferred_name);

  const handleChange = (type, text) => {
    if (type === "fn") {
      setFullName(text);
    } else if (type === "pn") {
      setPreferredName(text);
    }
  };

  const handleSubmit = () => {
    updateUser(
      "users.update",
      { user_id: user?.id, full_name: fullName, preferred_name: preferredName },
      (response, error) => {
        if (error) {
          console.error("Error updating user profile:", error);
          showError("Failed to update user profile. Please try again later.");
          return;
        }
        console.log("User profile updated successfully:", response);
        setIsOpen(false);
      }
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Edit My Profile</Modal.Header>
        <Modal.Body>
          <VStack space="5">
            <FormControl>
              <FormControl.Label>Full Name</FormControl.Label>
              <Input
                variant="rounded"
                size="lg"
                onChangeText={(text) => handleChange("fn", text)}
                value={fullName}
                placeholder="Full Name"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Preferred Name</FormControl.Label>
              <Input
                variant="rounded"
                size="lg"
                onChangeText={(text) => handleChange("pn", text)}
                value={preferredName}
                placeholder="Preferred Name"
              />
            </FormControl>
            {/* TODO: Add option to upload your profile image. */}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button
              variant="ghost"
              _text={{ color: "muted.400" }}
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            {/* TODO: Submit changes to the backend */}
            <Button onPress={handleSubmit}>Apply</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditProfileModal);
