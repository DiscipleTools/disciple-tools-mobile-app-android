import React, { useState } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//import { styles } from './TagsField.styles';

const TagsField = ({ value }) => {
  console.log('*** TAGS FIELD RENDER ***');

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO: implement
  const TagsFieldEdit = () => {
    return null;
  };

  const TagsFieldView = () => {
    return (
      <>
        {value.values.map((tag) => (
          <Text style={[{ marginBottom: 10 }, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {tag.value}
          </Text>
        ))}
      </>
    );
  };

  return <>{editing ? <TagsFieldEdit /> : <TagsFieldView />}</>;
};
export default TagsField;
