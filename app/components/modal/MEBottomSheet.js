import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(isVisible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(300)).current; // Initial position off-screen

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 300,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [isVisible, opacity, translateY]);

  const renderComponent = () => {
    if (!Component) return null;
    return <Component {...(componentProps || {})} closeModal={onClose} />;
  };

  return (
    <Modal
      animationType="none" // Disable default animation
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalContainer, { opacity }]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY }],
                },
              ]}>
              <View style={styles.header}>
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
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon
                    color="grey"
                    name="times-circle"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.content, contentStyle]}>
                {renderComponent()}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    minHeight: 300,
  },
  header: {
    backgroundColor: '#f2f3f5',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  content: {
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default MEBottomSheet;
