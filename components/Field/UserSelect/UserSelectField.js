import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Picker } from 'native-base';
import PostLink from 'components/PostLink';

import { styles } from './UserSelectField.styles';

const UserSelectField = ({ value, editing, onChange }) => {
  console.log('*** USER SELECT FIELD RENDER ***');

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO: how to best pull these lists?
  const [state, setState] = useState({
    users: [],
    assignedToContacts: [],
  });

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  const UserSelectFieldEdit = () => {
    return (
      <>
        <Picker
          mode="dropdown"
          selectedValue={value.key}
          onValueChange={handleChange}
          //textStyle={{ color: Colors.tintColor }}
        >
          {[...state.users, ...state.assignedToContacts, value].map((item) => {
            return (
              <Picker.Item
                key={item.key}
                label={item.label + ' (#' + item.key + ')'}
                value={item.key}
              />
            );
          })}
        </Picker>
        <Icon name="caret-down" size={10} style={styles.pickerIcon} />
      </>
    );
  };

  const UserSelectFieldView = () => {
    if (!value?.key || !value?.label) return null;
    const userId = parseInt(value.key);
    let userData = state.users.find(
      (existingUser) => existingUser?.key === userId || existingUser?.contactID === userId,
    );
    if (!userData) {
      userData = state?.usersContacts?.find(
        (existingUser) => existingUser.value === userId.toString(),
      );
    }
    return (
      <>
        <PostLink label={value.label} value={userData} type={'contacts'} />
        {editing ? <Icon name="caret-down" size={10} style={styles.pickerIcon} /> : null}
      </>
    );
  };

  return <>{editing ? <UserSelectFieldEdit /> : <UserSelectFieldView />}</>;
};
export default UserSelectField;
