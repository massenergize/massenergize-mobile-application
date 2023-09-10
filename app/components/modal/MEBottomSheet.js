import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import React, {Children} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const MEBottomSheet = ({isVisible, onClose, component}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                display: 'flex',
                paddingRight: 5,
                paddingTop: 5,
                paddingBottom: 10,
              }}>
              <Icon
                name="times-circle"
                style={{marginLeft: 'auto'}}
                size={24}
              />
            </TouchableOpacity>

            {component}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    minHeight: 300,
  },
});

export default MEBottomSheet;
