import React, { useEffect, useState } from 'react';
import { Keyboard, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

// Component Library (Native Base)
// Expo
// Redux

// Helpers/Utils
import i18n from 'languages';

// Custom Hooks
import useDebounce from 'hooks/useDebounce.js';
import useNetworkStatus from 'hooks/useNetworkStatus';

// Custom Components
import FilterOptionsPanel from 'components/FilterOptionsPanel';

// Third-party Components

// Assets
import { MaterialIcons } from '@expo/vector-icons';

// Styles
import { styles } from './SearchBar.styles';

const SearchBar = ({ setFilter, setOptionsFilter }) => {
  const isConnected = useNetworkStatus();
  const [showFilterOptionsPanel, setShowFilterOptionsPanel] = useState(false);

  const [searchString, setSearchString] = useState('');

  const debouncedSearchString = useDebounce(searchString, 500);

  useEffect(() => {
    if (debouncedSearchString) {
      setFilter(debouncedSearchString);
    }
  }, [debouncedSearchString]);

  const filterByText = (searchString) => {
    if (searchString.length < 1) {
      setSearchString('');
      setFilter('');
      Keyboard.dismiss();
    } else {
      setSearchString(searchString);
    }
  };

  const filterByOption = (filter) => {
    setOptionsFilter(filter);
    setShowFilterOptionsPanel(false);
  };

  return (
    <>
      <View style={styles.searchSection}>
        <MaterialIcons name="search" style={styles.searchIcon} />
        <TextInput
          placeholder={i18n.t('global.search')}
          value={searchString}
          onChangeText={(searchString) => filterByText(searchString)}
          autoCorrect={false}
          style={styles.input}
        />
        {searchString.length > 0 && (
          <MaterialIcons name="clear" style={styles.searchIcon} onPress={() => filterByText('')} />
        )}
        {isConnected && (
          <MaterialIcons
            name="filter-list"
            style={styles.searchIcon}
            onPress={() => setShowFilterOptionsPanel(!showFilterOptionsPanel)}
          />
        )}
      </View>
      {showFilterOptionsPanel && setOptionsFilter && (
        <FilterOptionsPanel setFilter={filterByOption} />
      )}
    </>
  );
};
SearchBar.propTypes = {
  setFilter: PropTypes.func.isRequired,
  setOptionsFilter: PropTypes.func,
};
export default SearchBar;
