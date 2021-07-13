import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
//import PropTypes from 'prop-types';

import MultiSelect from 'components/MultiSelect';

//import { styles } from './TagsField.styles';

const TagsField = ({ value, options, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const selectedItems = value?.values;

  const removeSelection = (deletedValue) => {
    const idx = selectedItems.findIndex((value) => value?.value === deletedValue?.value);
    if (idx > -1) {
      const newValues = [...selectedItems];
      const removed = newValues.splice(idx, 1);
      // https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#tags
      // per the API specs, we need to set a property 'deleted' rather than splice item from list
      const newApiValues = [...selectedItems];
      newApiValues[idx]['delete'] = true;
      onChange(
        {
          values: newValues,
        },
        {
          values: newApiValues,
        },
      );
    }
  };

  const TagsFieldEdit = () => (
    <MultiSelect
      items={options}
      selectedItems={selectedItems}
      // TODO: filter deleted
      //selectedItems={selectedItems.filter(value => !value?.deleted)}
      onChange={onChange}
      customRemoveSelection={removeSelection}
      placeholder={''}
    />
  );

  // TODO: links to FilterList
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
