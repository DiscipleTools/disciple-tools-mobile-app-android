import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
//import PropTypes from 'prop-types';

import useI18N from 'hooks/useI18N';
import useLocations from 'hooks/useLocations';

import MultiSelect from 'components/MultiSelect';

import { styles } from './LocationField.styles';

const LocationField = ({ value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();
  // All available Locations in D.T instance
  const items = useLocations();

  // Locations relevant to this particular Post
  const selectedItems = value?.values ?? null;

  /* TODO: enable search
  const searchLocationsDelayed = utils.debounce((queryText) => {
    console.log(`**** SEARCH LOCATIONS DELAYED/DEBOUNCE: ${queryText} ****`);
  }, 750);
  */

  const LocationFieldEdit = () => (
    <MultiSelect
      items={items}
      selectedItems={selectedItems}
      onChange={onChange}
      placeholder={i18n.t('global.selectLocations')}
    />
  );

  const LocationFieldView = () => {
    //return state.locations.map((location) => {
    return selectedItems.map((location) => {
      const isIOS = true;
      let mapURL = isIOS
        ? `http://maps.apple.com/?q=${location.name}`
        : `https://www.google.com/maps/search/?api=1&query=${location.name}`;
      if (location?.lat && location?.lng) {
        mapURL = isIOS
          ? `http://maps.apple.com/?ll=${location.lat},${location.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      }
      return (
        <Pressable onPress={() => Linking.openURL(mapURL)}>
          <Text style={[styles.linkingText, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {location.name}
          </Text>
        </Pressable>
      );
    });
  };

  return <>{editing ? <LocationFieldEdit /> : <LocationFieldView />}</>;
};
export default LocationField;
