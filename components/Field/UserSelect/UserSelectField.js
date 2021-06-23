import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Picker } from 'native-base';

import Colors from 'constants/Colors';

//import { styles } from "./UserSelectField.styles";

const UserSelectField = ({ value }) => {
  console.log('*** USER SELECT FIELD RENDER ***');

  const [state, setState] = useState({
    users: [],
    assignedToContacts: [],
  });

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const UserSelectFieldEdit = () => {
    return (
      <Picker
        mode="dropdown"
        selectedValue={value ?? null}
        onValueChange={(value) => {
          // TODO
          //setContactCustomFieldValue(field.name, value)
          //setGroupCustomFieldValue(field.name, value)}
        }}
        textStyle={{ color: Colors.tintColor }}>
        {[...state.users, ...state.assignedToContacts].map((item) => {
          return (
            <Picker.Item
              key={item.key}
              label={item.label + ' (#' + item.key + ')'}
              value={item.key}
            />
          );
        })}
      </Picker>
    );
  };

  // TODO: merge with View since it is only thing using this code
  const renderContactLink = (assignedTo) => {
    let foundContact, valueToSearch, nameToShow;
    if (assignedTo.key) {
      valueToSearch = assignedTo.key;
      nameToShow = assignedTo.label;
    } else if (assignedTo.value) {
      valueToSearch = assignedTo.value;
      nameToShow = assignedTo.name;
    }
    foundContact = state.users.find(
      (user) => user.key === parseInt(valueToSearch) || user.contactID === parseInt(valueToSearch),
    );
    if (!foundContact && state.usersContacts) {
      foundContact = state.usersContacts.find((user) => user.value === valueToSearch.toString());
    }
    // User have accesss to assigned_to user/contact
    if (foundContact && foundContact.contactID) {
      // Contact exist in 'state.users' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => goToContactDetailScreen(foundContact.contactID, nameToShow)}>
          <Text style={[styles.linkingText, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else if (foundContact) {
      // Contact exist in 'state.usersContacts' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => goToContactDetailScreen(valueToSearch, nameToShow)}>
          <Text style={[styles.linkingText, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else {
      // User does not exist in any list
      return (
        <Text
          style={[
            { marginTop: 4, marginBottom: 4, fontSize: 15 },
            isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {nameToShow}
        </Text>
      );
    }
  };

  const UserSelectFieldView = () => {
    return renderContactLink(value);
  };

  return <>{editing ? <UserSelectFieldEdit /> : <UserSelectFieldView />}</>;
};
export default UserSelectField;
