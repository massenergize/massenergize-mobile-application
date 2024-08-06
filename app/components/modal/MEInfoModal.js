/******************************************************************************
 *                            MEInfoModal
 * 
 *      This component displays an info button which opens a popup displaying
 *      the child elements, designed to display additional information to users
 *      on potentially confusing pages.
 * 
 *      Written by: William Soylemez
 *      Last edited: July 22, 2024
 * 
 *****************************************************************************/

import { useState } from "react";
import { IonicIcon } from "../icons";
import { TouchableOpacity, View, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";

const MEInfoModal = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
      >
        <IonicIcon
          name="information-circle-outline"
          size={24}
          color="green"
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {/* Close Icon */}
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeIcon}
              >
                <IonicIcon
                  name="close"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              {/* Modal body */}
              {children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default MEInfoModal;


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});