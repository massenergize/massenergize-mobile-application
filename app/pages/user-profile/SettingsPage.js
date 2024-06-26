/******************************************************************************
 *                            SettingsPage
 * 
 *      This page is responsible for rendering the settings page, which
 *      allows the user to edit their profile, change their email, change
 *      their password, change their notification preferences, and delete
 *      their account. Most functionality comes from modals in other files.
 * 
 *      Written by: William Soylemez and Moizes Almeida
 *      Last edited: June 26, 2024
 * 
 *****************************************************************************/

/* Imports and set up */
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Flex, Icon, Text, VStack } from "@gluestack-ui/themed-native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EditProfileModal from "./settingsModals/EditProfileModal";
import ChangeEmailModal from "./settingsModals/ChangeEmailModal";
import ChangePasswordModal from "./settingsModals/ChangePasswordModal";
import ChangeNotificationModal from "./settingsModals/ChangeNotificationModal";
import DeleteAccountModal from "./settingsModals/DeleteAccountModal";
import { connect } from "react-redux";
import { hasProvider } from "../../utils/common";

/* Constant that holds the options for the settings page */
const SettingOptions = [
  {
    name: "profile",
    label: "Edit my profile",
    icon: "user",
  },
  {
    name: "email",
    label: "Change my email",
    icon: "envelope",
    requiredAuth: "password"
  },
  {
    name: "password",
    label: "Change my password",
    icon: "key",
    requiredAuth: "password"
  },
  {
    name: "notification",
    label: "Change communication preferences",
    icon: "bell",
  },
  {
    name: "delete",
    label: "Delete my account",
    icon: "trash",
  },
];

function SettingsPage({ navigation, fireAuth }) {
  /* 
   * Uses local state to determine if the modal of each option should 
   * be open or not.
   */
  const [isEMPOpen, setIsEMPOpen] = useState(false);
  const [isCMEOpen, setIsCMEOpen] = useState(false);
  const [isCMPOpen, setIsCMPOpen] = useState(false);
  const [isNPOpen, setIsNPOpen] = useState(false);
  const [isDAOpen, setIsDAOpen] = useState(false);

  /* Open the appropriate modal based on the name */
  const handleOpenModal = (name) => {
    if (name === "profile") {
      setIsEMPOpen(true);
    } else if (name === "email") {
      setIsCMEOpen(true);
    } else if (name === "password") {
      setIsCMPOpen(true);
    } else if (name === "notification") {
      setIsNPOpen(true);
    } else if (name === "delete") {
      setIsDAOpen(true);
    }
  };

  /* Displays the settings page */
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>

      {/* Buttons to open modals */}
      <VStack space="5" pt="10" padding="5">
        {( SettingOptions.map((option, index) =>
          (
            hasProvider(fireAuth, option.requiredAuth) || !option.requiredAuth
          ) && (
              <TouchableOpacity
                key={index}
                onPress={() => handleOpenModal(option.name)}
              >
                <Flex flexDirection="row" alignItems="center">
                  <Icon
                    as={FontAwesome}
                    name={option.icon}
                    size="md"
                    color="primary.600"
                    textAlign="center"
                  />
                  <Text fontSize="md" flexGrow="1" style={{ marginLeft: 10}}>
                    {" "}
                    {option.label}{" "}
                  </Text>
                  <Icon
                    as={FontAwesome}
                    name="arrow-right"
                    size="md"
                    color="primary.600"
                  />
                </Flex>
              </TouchableOpacity>
            )
        ))}

        {/* Actual modal list (hidden initially) */}
        <EditProfileModal isOpen={isEMPOpen} setIsOpen={setIsEMPOpen} />
        <ChangeEmailModal isOpen={isCMEOpen} setIsOpen={setIsCMEOpen} />
        <ChangePasswordModal isOpen={isCMPOpen} setIsOpen={setIsCMPOpen} />
        <ChangeNotificationModal isOpen={isNPOpen} setIsOpen={setIsNPOpen} />
        <DeleteAccountModal
          isOpen={isDAOpen}
          setIsOpen={setIsDAOpen}
          navigation={navigation}
        />
      </VStack>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    fireAuth: state.fireAuth,
  };
}

export default connect(mapStateToProps)(SettingsPage);