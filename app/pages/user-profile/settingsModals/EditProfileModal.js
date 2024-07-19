/******************************************************************************
 *                            EditProfileModal
 * 
 *      Displays a modal that allows the user to edit their profile.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: July 19, 2024
 * 
 *****************************************************************************/

import React, { useState } from "react";
import { 
  Modal, 
  FormControl, 
  Input, 
  VStack, 
  Button,
  ScrollView,
  View
} from "@gluestack-ui/themed-native-base";
import { showError } from "../../../utils/common";
import { connect } from "react-redux";
import { updateUserAction } from "../../../config/redux/actions";
import {
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const EditProfileModal = ({ isOpen, setIsOpen, user }) => {
  /* 
   * Uses local state to set the full name of the user and also the 
   * preferred name.
   */
  const [fullName, setFullName] = useState(user?.full_name);
  const [preferredName, setPreferredName] = useState(user?.preferred_name);

  /* 
   * Function that handles a change in either the full name of the 
   * user or their preferred name. 
   */
  const handleChange = (type, text) => {
    if (type === "fn") {
      setFullName(text);
    } else if (type === "pn") {
      setPreferredName(text);
    }
  };

  /* Function that handles the action of submit of the user. */
  const handleSubmit = () => {
    updateUserAction(
      "users.update",
      { 
        user_id: user?.id, 
        full_name: fullName, 
        preferred_name: preferredName 
      },
      (response, error) => {
        if (error) {
          console.error("Error updating user profile:", error);
          showError("Failed to update user profile. Please try again later.");
          return;
        }
        console.log("User profile updated successfully");
        setIsOpen(false);
      }
    );
  }

  /* Displays the Edit Profile Modal */
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      transparent={true}
      animationType="slide"
    >
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
              alignSelf: 'center',
            }}
          >
            <Modal.Content
              style={{ 
                width: 300,
                alignSelf: 'center',
              }}
            >
              {/* Close Button */}
              <Modal.CloseButton />

              {/* Header */}
              <Modal.Header>Edit My Profile</Modal.Header>
              
              {/* Inputs */}
              <Modal.Body>
                <VStack space="5">
                  <FormControl>
                    {/* User's Full name */}
                    <FormControl.Label>Full Name</FormControl.Label>
                    <Input
                      variant="rounded"
                      size="lg"
                      onChangeText={(text) => handleChange("fn", text)}
                      value={fullName}
                      placeholder="Full Name"
                    />
                  </FormControl>

                  {/* User's Preferred Name */}
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
                </VStack>
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
                  <Button onPress={handleSubmit}>
                    Apply
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
 * EditProfileModal function, in which it is got from the API.
 */
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditProfileModal);
