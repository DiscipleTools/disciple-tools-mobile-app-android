import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon } from 'native-base';

import { styles } from './ActionModal.styles';

const ActionModal = ({ visible, onClose, title, fullScreen, width, height, children }) => {
  const isIOS = Platform.OS === 'ios';
  const windowHeight = useWindowDimensions().height;

  const fullSize = '95%';
  const modalWidth = fullScreen ? fullSize : width; // ? width : fullSize;
  const modalHeight = fullScreen ? fullSize : height; // ? height : fullSize;
  const dynamicSizeStyle = {
    width: modalWidth,
    height: modalHeight,
  };
  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'}>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onClose(!visible);
        }}
        statusBarTranslucent={true}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, dynamicSizeStyle]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.textHeader}>{title}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Pressable
                  style={styles.buttonClose}
                  onPress={() => {
                    onClose(!visible);
                  }}>
                  <Icon type="MaterialIcons" name="close" />
                </Pressable>
              </View>
            </View>
            <View style={styles.modalContent}>{children}</View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
export default ActionModal;
