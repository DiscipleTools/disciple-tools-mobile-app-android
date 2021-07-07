import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { styles } from './PostLink.styles';

const PostLink = ({ label, value, type }) => {
  console.log('*** POSTLINK RENDER ***');
  console.log(`value: ${JSON.stringify(value)} `);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const navigation = useNavigation();

  return (
    <Pressable
      disabled={!value}
      onPress={() => {
        navigation.push('Details', {
          id: value?.ID,
          name: value?.title,
          type,
          //onGoBack: () => onRefresh(),
        });
      }}>
      <Text
        style={[
          value ? styles.linkingText : null,
          isRTL ? { textAlign: 'left', flex: 1 } : { marginLeft: 15 },
          { fontSize: 16 },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};
export default PostLink;
