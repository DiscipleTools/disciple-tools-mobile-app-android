import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

// component library (native base)
import { Accordion, Icon, Input, Item } from 'native-base';
import { useSelector } from 'react-redux';

// helpers/utils
import Colors from 'constants/Colors';
import i18n from 'languages';
import utils from 'utils';

// custom components
//import useSettings from 'hooks/useSettings.js';
import useNetworkStatus from 'hooks/useNetworkStatus';
import useFilters from 'hooks/useFilters.js';

// third-party components
// NOTE: this is used to pass a custom component/icon as checkbox to preserve a standard look-and-feel across platform (which is not currently supported by native base)
import { CheckBox } from 'react-native-elements';

// styles/assets
import { styles } from './FilterOptionsPanel.styles';
import { MaterialIcons } from '@expo/vector-icons';

const FilterOptionsPanel = ({ setFilter }) => {
  const isConnected = useNetworkStatus();

  //const { settings, error: settingsError } = useSettings();
  const { customFilters, error: customFiltersError } = useFilters();
  //if (customFiltersError) showToast(customFiltersError.message, true);

  // TODO: use hook
  const userData = useSelector((state) => state.userReducer.userData);

  const initialState = {
    filter: {
      ID: null,
      name: null,
      query: null,
    },
  };
  const [state, setState] = useState(initialState);

  /*
  // TODO: ?? 
  const reset = () => {
    setState(initialState);
  };
  */

  const filterByOption = (ID, name, query) => {
    setState({
      filter: {
        ID,
        name,
        query,
      },
    });
    setFilter(query);
  };

  const renderHeader = (item, expanded) => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: expanded ? Colors.primary : '#FFFFFF',
            height: 50,
            paddingLeft: 15,
            paddingRight: 15,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.grayLight,
            width: '100%',
          },
        ]}>
        <Text
          style={{
            color: expanded ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            fontWeight: 'bold',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: expanded ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginRight: 'auto',
          }}>
          {item.count ? (
            <Text
              style={{
                color: expanded ? '#FFFFFF' : Colors.primary,
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
              {` (${item.count})`}
            </Text>
          ) : null}
        </Text>
        <Text
          style={{
            color: expanded ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto',
          }}>
          {expanded ? '-' : '+'}
        </Text>
      </View>
    );
  };

  const renderContent = (item, expanded) => {
    const content = item.content;
    return (
      <View
        key={item}
        style={{
          //borderWidth: 1,
          //borderColor: Colors.grayLight,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 10,
        }}>
        {content.length > 0 ? (
          content.map((filter) => {
            const subfilter = filter?.subfilter ?? 0;
            let indent = 0;
            if (typeof subfilter !== 'boolean') {
              indent = 20 * subfilter; // 1, 2, ...
            }
            return (
              <Pressable
                key={filter.ID}
                onPress={() => filterByOption(filter.ID, filter.name, filter.query)}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 50,
                    paddingLeft: indent,
                  }}>
                  <CheckBox
                    checked={filter.ID === state.filter.ID}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    onPress={() => filterByOption(filter.ID, filter.name, filter.query)}
                    containerStyle={{ padding: 0, margin: 0 }}
                  />
                  <Text
                    style={{
                      paddingTop: Platform.OS === 'ios' ? 4 : 0,
                    }}>
                    {filter.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 'auto',
                      paddingTop: Platform.OS === 'ios' ? 4 : 0,
                    }}>
                    {filter.count}
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <Text>{i18n.t('global.noFilters')}</Text>
        )}
      </View>
    );
  };

  if (!customFilters) return null;
  return (
    <View>
      <Item regular>
        <Accordion
          dataArray={customFilters}
          animation={true}
          expanded={true}
          renderHeader={renderHeader}
          renderContent={renderContent}
          //activeSections={null}
          //sections={null}
        />
        {/* TODO: state.filter &&
          !state.filter.toggle &&
          ((state.search && state.search.length > 0) || state.filter.name.length > 0) && (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {state.search && state.search.length > 0 && (
                <Text style={styles.chip}>{state.search}</Text>
              )}
              {state.filter.name.length > 0 && <Text style={styles.chip}>{state.filter.name}</Text>}
              {fieldName && <Text style={styles.chip}>{fieldName}</Text>}
            </View>
          )*/}
      </Item>
    </View>
  );
};
/*
  let fieldName = null;
  if (state.filter && state.filter.query && state.filter.query.sort) {
    // TODO: something better than this call method?
    if (
      settings &&
      Object.prototype.hasOwnProperty.call(
        settings.fields,
        state.filter.query.sort.replace('-', ''),
      )
    ) {
      fieldName =
        i18n.t('global.sortBy') +
        ': ' +
        settings.fields[state.filter.query.sort.replace('-', '')].name;
    }
  }
  */
FilterOptionsPanel.propTypes = {
  setFilter: PropTypes.func.isRequired,
};
export default FilterOptionsPanel;
