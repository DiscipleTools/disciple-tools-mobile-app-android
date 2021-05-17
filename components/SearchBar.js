import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import PropTypes from 'prop-types';
// component library (native base)
import { Accordion, Icon, Input, Item } from 'native-base';
import { useSelector } from 'react-redux';
// helpers/utils
import Colors from 'constants/Colors';
import i18n from 'languages';
import utils from 'utils';
// custom components
// third-party components
// NOTE: this is used to pass a custom component/icon as checkbox to preserve a standard look-and-feel across platform (which is not currently supported by native base)
import { CheckBox } from 'react-native-elements';
// styles/assets
import { styles } from './SearchBar.styles';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = ({ settings }) => {
  //console.log("*** SearchBar Component - settings: ***");
  //console.log(JSON.stringify(settings));

  const userData = useSelector((state) => state.userReducer.userData);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);

  const initialState = {
    search: '',
    filter: {
      toggle: false,
      ID: '',
      query: {},
      name: '',
    },
    filterConfig: {
      tabs: [],
      filters: [],
    },
    sections: [],
    activeSections: [],
    count: null,
  };
  const [state, setState] = useState(initialState);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const filterByText = (text) => {
    setState(
      {
        search: text,
        activeSections: initialState.activeSections,
        // Reset option filter to their initial state
        filter: {
          ...initialState.filter,
          query: {
            ...initialState.filter.query,
            sort: 'name',
          },
        },
      },
      () => {
        onTextFilter(text);
      },
    );
  };

  const filterByOption = (filterId, filterQuery, filterName) => {
    console.log('*** FILTER BY OPTION ***');
    console.log(JSON.stringify(filterQuery));
    // TODO: move the mapping to the Saga
    const origRes = utils.mapFilterOnQueryParams(filterQuery, userData);
    console.log(origRes);
    /*
      {
        filtered: true,
        filterText: null,
        filterOption: selectedFilter,
      },
Q: How to differentiate Notifications from Contacts
use 'post_title'
{"id":"321","user_id":"1","source_user_id":"0","post_id":"109","secondary_item_id":"0","notification_name":"requires_update","notification_action":"alert","notification_note":"@zzadmin, an update is requested on <a href=\"http://192.168.1.7/contacts/109\">Farzin Shariati</a>.","date_notified":"2020-12-06 03:35:10","is_new":"0","field_key":"","field_value":"","post_title":"Farzin Shariati","pretty_time":["4 months ago","12/06/2020"]}
*** RENDER ROW ***
{"id":"322","user_id":"1","source_user_id":"0","post_id":"106","secondary_item_id":"0","notification_name":"requires_update","notification_action":"alert","notification_note":"@zzadmin, an update is requested on <a href=\"http://192.168.1.7/contacts/106\">Elias Alvarado</a>.","date_notified":"2020-12-06 03:35:10","is_new":"0","field_key":"","field_value":"","post_title":"Elias Alvarado","pretty_time":["4 months ago","12/06/2020"]}

*/
    //const recursRes = utils.recursivelyMapFilterOnQueryParams(filterQuery,'',userData);
    //console.log(recursRes);
    /*
    // Set 'last_modified' sort by default on OFFLINE mode or filter does not have sort
    if (
      (isConnected && !Object.prototype.hasOwnProperty.call(filterQuery, 'sort')) ||
      !isConnected
    ) {
      if (!Object.prototype.hasOwnProperty.call(filterQuery, 'sort')) {
        filterQuery = {
          ...filterQuery,
          sort: '-last_modified',
        };
      }
    }
    setState(
      {
        filter: {
          ID: filterId,
          toggle: false,
          query: {
            ...filterQuery,
          },
          name: filterName,
        },
        activeSections: initialState.activeSections,
        // Reset text filter to their initial state
        search: initialState.search,
      },
      () => {
        onSelectFilter({
          ...filterQuery,
        });
      },
    );
    */
  };

  const clearTextFilter = () => {
    setState(
      {
        search: initialState.search,
      },
      () => {
        onClearTextFilter('');
      },
    );
  };

  const resetFilters = () => {
    setState(
      (prevState) => ({
        ...initialState,
        sections: [...prevState.sections],
      }),
      () => {
        onClearTextFilter('');
      },
    );
  };

  // Function used to update render on Contact/Group screens when current filter its active
  const refreshFilter = () => {
    if (state.search && state.search.length > 0) {
      filterByText(state.search);
    } else if (state.filter.ID.length > 0) {
      filterByOption(state.filter.ID, state.filter.query, state.filter.name);
    }
  };

  const updateSections = (activeSections) => {
    setState({ activeSections });
  };

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

  // TODO: if selected, dynamically update the title property and include group by?
  // or are the 'chips' good enough?
  // enable multiple selections: 'by type'='unread' AND 'by user'='Farzin Shariati'
  // TODO: Q: what is 'query' doing? is this the URL mapping?
  const dataArray = [
    {
      title: 'By Type',
      count: 2,
      content: [
        {
          ID: 0,
          name: 'All',
          count: 2,
          query: '',
        },
        {
          ID: 1,
          name: 'Read',
          count: 1,
          query: '',
        },
        {
          ID: 2,
          name: 'Unread',
          count: 1,
          query: '',
        },
      ],
    },
    {
      title: 'By User',
      count: 2,
      content: [
        {
          ID: 0,
          name: 'Farzin Shariati',
          count: 1,
          query: '',
        },
        {
          ID: 1,
          name: 'Elias Alvarado',
          count: 1,
          query: '',
        },
      ],
    },
  ];

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
            borderWidth: 1,
            borderColor: Colors.grayLight,
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
    //let content = state.filterConfig.filters.filter((filter) => filter.tab === section.key);
    const content = item.content;
    return (
      <View
        key={item}
        style={{
          borderWidth: 1,
          borderColor: Colors.grayLight,
          padding: 15,
        }}>
        {content.length > 0 ? (
          content.map((filter) => (
            <TouchableOpacity
              key={filter.ID}
              activeOpacity={0.5}
              onPress={() => {
                //console.log(`*** FILTER BY OPTON: ${ JSON.stringify(filter) }***`);
                filterByOption(filter.ID, filter.query, filter.name);
                //setShowFiltersPanel(false);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 50,
                  paddingLeft: filter.subfilter ? 20 : 0,
                }}>
                <CheckBox
                  //checked={filter.ID === state.filter.ID}
                  checked={false}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  containerStyle={{
                    padding: 0,
                    margin: 0,
                  }}
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
            </TouchableOpacity>
          ))
        ) : (
          <Text>{i18n.t('global.noFilters')}</Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.searchBarContainer,
        Platform.OS == 'ios'
          ? { borderBottomColor: Colors.grayLight, borderBottomWidth: 1 }
          : { elevation: 5 },
        {},
      ]}>
      <ScrollView style={styles.searchBarScrollView}>
        <Item regular style={styles.searchBarItem}>
          <MaterialIcons name="search" style={styles.searchBarIcons} />
          <Input
            placeholder={i18n.t('global.search')}
            onChangeText={filterByText}
            autoCorrect={false}
            value={state.search}
            style={styles.searchBarInput}
          />
          {state.search && state.search.length > 0 ? (
            <MaterialIcons
              name="clear"
              style={[styles.searchBarIcons, { marginRight: 10 }]}
              onPress={clearTextFilter}
            />
          ) : null}
          <MaterialIcons
            name="filter-list"
            style={styles.searchBarIcons}
            onPress={() => {
              setShowFiltersPanel(!showFiltersPanel);
            }}
          />
        </Item>
        {/*state.filter && state.filter.toggle && state.filterConfig ? (*/}
        {showFiltersPanel && (
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Accordion
              dataArray={dataArray}
              animation={true}
              expanded={true}
              renderHeader={renderHeader}
              renderContent={renderContent}
              //activeSections={state.activeSections}
              //sections={state.filterConfig.tabs}
              //onChange={updateSections}
            />
          </View>
        )}
        {state.filter &&
          !state.filter.toggle &&
          ((state.search && state.search.length > 0) || state.filter.name.length > 0) && (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {state.search && state.search.length > 0 && (
                <Text style={styles.chip}>{state.search}</Text>
              )}
              {state.filter.name.length > 0 && <Text style={styles.chip}>{state.filter.name}</Text>}
              {fieldName && <Text style={styles.chip}>{fieldName}</Text>}
            </View>
          )}
      </ScrollView>
    </View>
  );
};
/* TODO
SearchBar.propTypes = {
  filterConfig: {
    tabs: [],
    filters: [],
  },
};
*/
export default SearchBar;
