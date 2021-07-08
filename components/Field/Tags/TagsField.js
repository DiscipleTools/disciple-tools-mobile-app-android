import React, { useState } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import MultiSelect from 'components/MultiSelect';

//import { styles } from './TagsField.styles';

const TagsField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO:
  const tagsList = [
    { value: -1, name: 'surfers' },
    { value: -2, name: 'jovenes' },
    { value: -3, name: 'zz' },
  ];
  const TagsFieldEdit = () => (
    <MultiSelect
      items={tagsList}
      selectedItems={value?.values}
      onChange={onChange}
      placeholder={'zzzzz'}
    />
  );

  // TODO: styling
  const TagsFieldView = () => (
    <>
      {value.values.map((tag) => (
        <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{tag.value}</Text>
      ))}
    </>
  );

  return <>{editing ? <TagsFieldEdit /> : <TagsFieldView />}</>;
};
export default TagsField;
