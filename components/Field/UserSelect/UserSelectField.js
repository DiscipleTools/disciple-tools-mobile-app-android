import React from 'react';
import { Icon } from 'native-base';
//import PropTypes from 'prop-types';

import useI18N from 'hooks/useI18N';
import useUsers from 'hooks/useUsers';

import SingleSelect from 'components/SingleSelect';
import PostLink from 'components/PostLink';

import { styles } from 'components/Field/Field.styles';

const UserSelectField = ({ value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();
  const { users } = useUsers();

  if (!value?.key || !value?.label || !users) return null;

  const user = users?.find((existingUser) => existingUser.ID === value.key);

  const handleChange = (newValue) => {
    const apiValue = newValue.key;
    if (newValue !== value) onChange(newValue, apiValue);
  };

  const UserSelectFieldEdit = () => (
    <SingleSelect items={users} selectedItem={value} onChange={handleChange} />
  );

  const UserSelectFieldView = () => {
    const id = !user ? null : user?.contact_id ?? null;
    const title = !user ? value.label : user?.name ?? null;
    return (
      <>
        <PostLink id={id} title={title} type={'contacts'} />
        {editing ? <Icon name="caret-down" size={10} style={styles.pickerIcon} /> : null}
      </>
    );
  };

  return <>{editing ? <UserSelectFieldEdit /> : <UserSelectFieldView />}</>;
};
export default UserSelectField;
