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

const MEBottomSheet = ({
  isVisible,
  onClose,
  Component,
  title,
  titleStyle,
  contentStyle,
  componentProps,
}) => {
  const renderComponent = () => {
    if (!Component) return <></>;

    return <Component {...(componentProps || {})} closeModal={onClose} />;
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                backgroundColor: '#f2f3f5',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              {title && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    ...(titleStyle || {}),
                  }}>
                  {title}
                </Text>
              )}
              <TouchableOpacity onPress={onClose} style={{marginLeft: 'auto'}}>
                <Icon
                  color="grey"
                  name="times-circle"
                  style={{marginLeft: 'auto'}}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={contentStyle || {}}>{renderComponent()}</View>
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
    // padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    minHeight: 300,
  },
});

export default MEBottomSheet;
