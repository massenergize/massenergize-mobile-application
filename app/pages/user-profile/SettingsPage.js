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

const SettingOptions = [
  {
    name: "profile",
    label: "Edit my profile",
    icon: "user",
  },
  // {
  //   name: "email",
  //   label: "Change my email",
  //   icon: "envelope",
  // },
  {
    name: "password",
    label: "Change my password",
    icon: "key",
    requiredAuth: "password"
  },
  // {
  //   name: "notification",
  //   label: "Change communication preferences",
  //   icon: "bell",
  // },
  {
    name: "delete",
    label: "Delete my account",
    icon: "trash",
  },
];

function SettingsPage({ navigation, fireAuth }) {
  const [isEMPOpen, setIsEMPOpen] = useState(false);
  const [isCMEOpen, setIsCMEOpen] = useState(false);
  const [isCMPOpen, setIsCMPOpen] = useState(false);
  const [isNPOpen, setIsNPOpen] = useState(false);
  const [isDAOpen, setIsDAOpen] = useState(false);


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

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
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
                  <Text fontSize="md" px="5" flexGrow="1">
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
        <EditProfileModal isOpen={isEMPOpen} setIsOpen={setIsEMPOpen} />
        {/* <ChangeEmailModal isOpen={isCMEOpen} setIsOpen={setIsCMEOpen} /> */}
        <ChangePasswordModal isOpen={isCMPOpen} setIsOpen={setIsCMPOpen} />
        {/* <ChangeNotificationModal isOpen={isNPOpen} setIsOpen={setIsNPOpen} /> */}
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