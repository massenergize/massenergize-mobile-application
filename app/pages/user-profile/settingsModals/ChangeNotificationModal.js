import React, { useState } from "react";
import { Modal, Radio, Text, Button } from "@gluestack-ui/themed-native-base";
import { showError, showSuccess, updateUser } from "../../../utils/common";
import { connect } from "react-redux";

const ChangeNotificationModal = ({ isOpen, setIsOpen, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialState = Object.keys(user?.preferences?.user_portal_settings?.communication_prefs?.update_frequency ?? {})[0];
  const [notificationFrequency, setNotificationFrequency] = useState(initialState || "per_day");

  // TODO: Handle form submission
  const handleSave = () => {

    // For some reason we have to give it all the old preferences as well
    let preferences = user?.preferences;
    delete preferences
      .user_portal_settings
      .communication_prefs
      .update_frequency;
    preferences
      .user_portal_settings
      .communication_prefs
      .update_frequency = {[notificationFrequency]: true};

    setIsSubmitting(true);
    updateUser(
      "users.update",
      { user_id: user?.id, preferences: JSON.stringify(preferences) },
      (response, error) => {
        if (error) {
          console.error("Error updating notification frequency:", error);
          showError("Failed to update notification frequency. Please try again later.");
          setIsSubmitting(false);
          return;
        }
        console.log("Notification frequency updated successfully");
        showSuccess("Notification frequency updated successfully");
        setIsOpen(false);
        setIsSubmitting(false);
      });
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Communication Preferences</Modal.Header>
        <Modal.Body>
          <Text mb="5">
            How often would you like to be notified about new events?
          </Text>
          <Radio.Group
            name="notificationFrequency"
            accessibilityLabel="Communication Preferences"
            value={notificationFrequency}
            onChange={setNotificationFrequency}
          >
            <Radio my="2" value="per_day">
              Daily
            </Radio>
            <Radio my="2" value="per_week">
              Weekly
            </Radio>
            <Radio my="2" value="biweekly">
              Biweekly
            </Radio>
            <Radio my="2" value="per_month">
              Monthly
            </Radio>
            <Radio my="2" value="never">
              Never
            </Radio>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button variant="ghost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              isLoading={isSubmitting}
              isLoadingText="Saving..."
              onPress={handleSave}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ChangeNotificationModal);
