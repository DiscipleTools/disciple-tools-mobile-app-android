import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Custom Hooks
import useLocations from 'hooks/useLocations';

import i18n from 'languages';
//import utils from 'utils';

import MultiSelect from 'components/MultiSelect';

import { styles } from './LocationField.styles';

const LocationField = ({ value, editing, onChange }) => {
  // All available Locations in D.T instance
  const instanceLocations = useLocations();

  // Locations relevant to this particular Post
  const locations = value.values;

  const [state, setState] = useState({
    locations,
  });

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  /*
  const searchLocationsDelayed = utils.debounce((queryText) => {
    console.log(`**** SEARCH LOCATIONS DELAYED/DEBOUNCE: ${queryText} ****`);
  }, 750);
  */

  const LocationFieldEdit = () => (
    <MultiSelect
      items={instanceLocations}
      selectedItems={state.locations}
      onChange={onChange}
      placeholder={i18n.t('global.selectLocations')}
    />
  );

  const LocationFieldView = () => {
    //return state.locations.map((location) => {
    return value.values.map((location) => {
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
