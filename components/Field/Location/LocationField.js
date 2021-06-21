import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

// Custom Hooks
import useLocations from 'hooks/useLocations';

import i18n from 'languages';
import utils from 'utils';

import { Chip, Selectize } from 'react-native-material-selectize';

import { styles } from './LocationField.styles';

const LocationField = ({ value }) => {
  console.log('*** LOCATION FIELD RENDER ***');

  // All available Locations in D.T instance
  const instanceLocations = useLocations();

  // Locations relevant to this particular Post
  const postLocations = value.values;

  // ensure postLocation is still a valid instanceLocation
  const getSelectizeItems = (selectedLocations, instanceLocations) => {
    const items = new Set(); // avoid duplicates
    selectedLocations?.forEach((selectedLocation) => {
      const foundItem = instanceLocations.find(
        (instanceLocation) => instanceLocation.value === selectedLocation.value,
      );
      if (foundItem) items.add(foundItem);
    });
    return [...items];
  };

  const [state, setState] = useState({
    locations: getSelectizeItems(postLocations, instanceLocations),
  });

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const searchLocationsDelayed = utils.debounce((queryText) => {
    console.log(`**** SEARCH LOCATIONS DELAYED/DEBOUNCE: ${queryText} ****`);
    /* TODO
    setState(
      {
        ...state,
        foundGeonames: [],
      },
      () => {
        if (queryText.length > 0) {
          dispatch(searchLocations(queryText));
        }
      },
    );
    */
  }, 750);

  const LocationFieldEdit = () => (
    <Selectize
      itemId="value"
      items={instanceLocations}
      selectedItems={state.locations}
      textInputProps={{
        placeholder: i18n.t('global.selectLocations'),
        onChangeText: searchLocationsDelayed,
      }}
      renderChip={(id, onClose, item, style, iconStyle) => (
        <Chip key={id} iconStyle={iconStyle} onClose={onClose} text={item.name} style={style} />
      )}
      renderRow={(id, onPress, item) => (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.selectizeRowText}>{item.name}</Text>
        </View>
      )}
      filterOnKey="name"
      onChangeSelectedItems={(selectedItems) => {
        console.log(`onChangeSelectedItems: ${JSON.stringify(selectedItems)} `);
        /*
        setState({
          ...state,
          locations: [...state.locations, selectedItems]
        });
        */
      }}
      inputContainerStyle={styles.selectizeField}
      containerStyle={{ zIndex: 42 }}
      listStyle={{ position: 'absolute' }}
    />
  );

  const LocationFieldView = () => (
    <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>
      {state.locations.map((location) => location.name).join(', ')}
    </Text>
  );

  return <>{editing ? <LocationFieldEdit /> : <LocationFieldView />}</>;
};
export default LocationField;
