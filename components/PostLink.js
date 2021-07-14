import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import useI18N from 'hooks/useI18N';

import { styles } from './PostLink.styles';

const PostLink = ({ id, title, type }) => {
  const navigation = useNavigation();
  const { i18n, isRTL } = useI18N();

  // TODO: move inline styles to PostLink.styles
  return (
    <Pressable
      disabled={!id || type === 'people_groups'}
      onPress={() => {
        navigation.push('Details', {
          id,
          // TODO: rename prop to 'title' for consistency sake?
          name: title,
          type,
          //onGoBack: () => onRefresh(),
        });
      }}>
      <Text
        style={[
          id && !type === 'people_groups' ? styles.linkingText : null,
          isRTL ? { textAlign: 'left', flex: 1 } : null,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};
export default PostLink;
