import React, { useState } from "react";
import { Modal, Radio, Text, Button } from "@gluestack-ui/themed-native-base";
import { showError, showSuccess, updateUser } from "../../../utils/common";
import { connect } from "react-redux";

const ChangeNotificationModal = ({ isOpen, setIsOpen, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState("weekly");

  // TODO: Handle form submission
  const handleSave = () => {
    setIsSubmitting(true);
    updateUser(
      "users.update",
      { notification_frequency: notificationFrequency, user_id: user?.id },
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
            <Radio my="2" value="daily">
              Daily
            </Radio>
            <Radio my="2" value="weekly">
              Weekly
            </Radio>
            <Radio my="2" value="biweekly">
              Biweekly
            </Radio>
            <Radio my="2" value="monthly">
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
