// helpers = stateful, and may contain components
// utils = stateles
import React from 'react';
import { Platform } from 'react-native';
import { Picker, Toast } from 'native-base';
import PropTypes from 'prop-types';

import locales from 'languages/locales';
import i18n from 'languages';

import { Html5Entities } from 'html-entities';

// { key: 1, label: "mylabel", value: "myval" }
/*
export const renderPickerItem = (item) => (
  <Picker.Item key={item.key} label={item.label} value={item.value} />
);
*/
export const isIOS = Platform.OS === 'ios';

// TODO: refactor to use renderPickerItems above?
//renderPickerItem({ key: locale.code, label: locale.name, value: locale.code })
export const renderLanguagePickerItems = locales.map((locale) => (
  <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
));

// NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
const DEFAULT_WAIT = 500;
export const showToast = (message, error = false) => {
  if (error) {
    const text = `${i18n.t('global.error.text')} ${message}`;
    setTimeout(() => {
      Toast.show({
        text,
        duration: 5000,
        type: 'danger',
      });
    }, DEFAULT_WAIT);
  } else {
    setTimeout(() => {
      Toast.show({
        text: message,
        duration: 3000,
      });
    }, DEFAULT_WAIT);
  }
};

export const withPropsValidation = (propTypes, props) => {
  PropTypes.checkPropTypes(propTypes, props, 'prop', '');
  return props;
};

/*
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
*/
const mapContacts = (contacts, entities) => {
  if (!entities) entities = new Html5Entities();
  return contacts.map((contact) => {
    const mappedContact = {};
    Object.keys(contact).forEach((key) => {
      const value = contact[key];
      const valueType = Object.prototype.toString.call(value);
      switch (valueType) {
        case '[object Boolean]': {
          mappedContact[key] = value;
          return;
        }
        case '[object Number]': {
          if (key === 'ID') {
            mappedContact[key] = value.toString();
          } else {
            mappedContact[key] = value;
          }
          return;
        }
        case '[object String]': {
          let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
          if (value.includes('quick_button')) {
            mappedContact[key] = parseInt(value, 10);
          } else if (key === 'post_title') {
            // Decode HTML strings
            mappedContact.title = entities.decode(value);
          } else if (dateRegex.test(value)) {
            // Date (post_date)
            var match = value.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
            var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
            mappedContact[key] = (date.getTime() / 1000).toString();
          } else {
            mappedContact[key] = entities.decode(value);
          }
          return;
        }
        case '[object Object]': {
          if (
            Object.prototype.hasOwnProperty.call(value, 'key') &&
            Object.prototype.hasOwnProperty.call(value, 'label')
          ) {
            // key_select
            mappedContact[key] = value.key;
          } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
            // date
            mappedContact[key] = value.timestamp;
          } else if (key === 'assigned_to') {
            // assigned-to property
            mappedContact[key] = {
              key: parseInt(value['assigned-to'].replace('user-', '')),
              label: value['display'],
            };
          }
          return;
        }
        case '[object Array]': {
          const mappedValue = value.map((valueTwo) => {
            const valueTwoType = Object.prototype.toString.call(valueTwo);
            switch (valueTwoType) {
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(valueTwo, 'post_title')) {
                  // connection
                  return {
                    value: valueTwo.ID.toString(),
                    name: entities.decode(valueTwo.post_title),
                  };
                }
                if (
                  Object.prototype.hasOwnProperty.call(valueTwo, 'key') &&
                  Object.prototype.hasOwnProperty.call(valueTwo, 'value')
                ) {
                  return {
                    key: valueTwo.key,
                    value: valueTwo.value,
                  };
                }
                if (
                  Object.prototype.hasOwnProperty.call(valueTwo, 'id') &&
                  Object.prototype.hasOwnProperty.call(valueTwo, 'label')
                ) {
                  return {
                    value: valueTwo.id.toString(),
                    name: valueTwo.label,
                  };
                }
                break;
              }
              case '[object String]': {
                return {
                  value: valueTwo,
                };
              }
              default:
            }
            return valueTwo;
          });
          if (key.includes('contact_')) {
            mappedContact[key] = mappedValue;
          } else {
            mappedContact[key] = {
              values: mappedValue,
            };
          }
          break;
        }
        default:
      }
    });
    return mappedContact;
  });
};

const mapContact = (contact, entities) => {
  return mapContacts([contact], entities)[0];
};

const mapGroups = (groups, entities) => {
  if (!entities) entities = new Html5Entities();
  return groups.map((group) => {
    const mappedGroup = {};
    Object.keys(group).forEach((key) => {
      const value = group[key];
      const valueType = Object.prototype.toString.call(value);
      switch (valueType) {
        case '[object Boolean]': {
          mappedGroup[key] = value;
          return;
        }
        case '[object Number]': {
          if (key === 'ID') {
            mappedGroup[key] = value.toString();
          } else {
            mappedGroup[key] = value;
          }
          return;
        }
        case '[object String]': {
          let dateRegex = /^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/;
          if (value.includes('quick_button')) {
            mappedGroup[key] = parseInt(value, 10);
          } else if (key === 'post_title') {
            // Decode HTML strings
            mappedGroup.title = entities.decode(value);
          } else if (dateRegex.test(value)) {
            // Date (post_date)
            var match = value.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
            var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
            mappedGroup[key] = (date.getTime() / 1000).toString();
          } else {
            mappedGroup[key] = entities.decode(value);
          }
          return;
        }
        case '[object Object]': {
          if (
            Object.prototype.hasOwnProperty.call(value, 'key') &&
            Object.prototype.hasOwnProperty.call(value, 'label')
          ) {
            // key_select
            mappedGroup[key] = value.key;
          } else if (Object.prototype.hasOwnProperty.call(value, 'timestamp')) {
            // date
            mappedGroup[key] = value.timestamp;
          } else if (key === 'assigned_to') {
            // assigned-to property
            mappedGroup[key] = {
              key: parseInt(value['assigned-to'].replace('user-', '')),
              label: value['display'],
            };
          }
          return;
        }
        case '[object Array]': {
          const mappedValue = value.map((valueTwo) => {
            const valueTwoType = Object.prototype.toString.call(valueTwo);
            switch (valueTwoType) {
              case '[object Object]': {
                if (Object.prototype.hasOwnProperty.call(valueTwo, 'post_title')) {
                  // connection
                  let object = {
                    value: valueTwo.ID.toString(),
                    name: entities.decode(valueTwo.post_title),
                  };
                  // groups
                  if (Object.prototype.hasOwnProperty.call(valueTwo, 'baptized_member_count')) {
                    object = {
                      ...object,
                      baptized_member_count: valueTwo.baptized_member_count,
                    };
                  }
                  if (Object.prototype.hasOwnProperty.call(valueTwo, 'member_count')) {
                    object = {
                      ...object,
                      member_count: valueTwo.member_count,
                    };
                  }
                  if (Object.prototype.hasOwnProperty.call(valueTwo, 'is_church')) {
                    object = {
                      ...object,
                      is_church: valueTwo.is_church,
                    };
                  }
                  return object;
                }
                if (
                  Object.prototype.hasOwnProperty.call(valueTwo, 'key') &&
                  Object.prototype.hasOwnProperty.call(valueTwo, 'value')
                ) {
                  return {
                    key: valueTwo.key,
                    value: valueTwo.value,
                  };
                }
                if (
                  Object.prototype.hasOwnProperty.call(valueTwo, 'id') &&
                  Object.prototype.hasOwnProperty.call(valueTwo, 'label')
                ) {
                  return {
                    value: valueTwo.id.toString(),
                    name: valueTwo.label,
                  };
                }
                break;
              }
              case '[object String]': {
                return {
                  value: valueTwo,
                };
              }
              default:
            }
            return valueTwo;
          });
          if (key.includes('contact_')) {
            mappedGroup[key] = mappedValue;
          } else {
            mappedGroup[key] = {
              values: mappedValue,
            };
          }
          break;
        }
        default:
      }
    });
    return mappedGroup;
  });
};

const mapGroup = (group, entities) => {
  return mapGroups([group], entities)[0];
};

// TODO: merge mapContacts and mapGroups?
// TODO: export only plural versions and check length here?
export default {
  mapContacts,
  mapContact,
  mapGroups,
  mapGroup,
};
