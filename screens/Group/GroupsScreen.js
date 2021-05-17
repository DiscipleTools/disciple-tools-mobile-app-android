import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Fab, Container, Icon } from 'native-base';
import PropTypes from 'prop-types';

import { getAll, getGroupSettings, updatePrevious } from 'store/actions/groups.actions';
import { getGroupFilters } from 'store/actions/users.actions';

import Colors from 'constants/Colors';
import i18n from 'languages';
import { showToast } from 'helpers';

import utils from 'utils';

import FilterList from 'components/FilterList';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';

import { styles } from './GroupsScreen.styles';

const GroupsScreen = ({ navigation }) => {
  const statusCircleSize = 15;

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.userReducer.userData);
  const groups = useSelector((state) => state.groupsReducer.groups);
  const loading = useSelector((state) => state.groupsReducer.loading);
  const error = useSelector((state) => state.groupsReducer.error);
  const groupSettings = useSelector((state) => state.groupsReducer.settings);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);
  const groupFilters = useSelector((state) => state.usersReducer.groupFilters);
  const totalGroups = useSelector((state) => state.groupsReducer.total);
  const filteredGroups = useSelector((state) => state.groupsReducer.filteredGroups);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const [state, setState] = useState({
    dataSourceGroups: [],
    //dataSourceGroupsFiltered: [],
    offset: 0,
    limit: utils.paginationLimit,
    sort: '-last_modified',
    filtered: false,
    filterOption: null,
    filterText: null,
    fixFABIndex: false,
    //isConnected: false,
  });

  useEffect(() => {
    dispatch(getGroupSettings());
    dispatch(getGroupFilters());
    dispatch(getAll(state.offset, state.limit, state.sort));
  }, []);

  /*
  componentDidMount() {
    // Recieve custom filters (tag) as param
    const { params } = navigation.state;
    if (params) {
      const { customFilter } = params;
      selectOptionFilter(customFilter);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { groups, filteredGroups } = nextProps;
    let { filtered } = prevState;

    let newState = {
      ...prevState,
    };

    if (filtered) {
      newState = {
        ...newState,
        dataSourceGroups: [...filteredGroups],
      };
    } else {
      newState = {
        ...newState,
        dataSourceGroups: [...groups],
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error, filteredGroups, isConnected } = 
    const { filtered } = state;

    if (
      filteredGroups &&
      filteredGroups !== prevProps.filteredGroups &&
      filteredGroups.length === 0 &&
      filtered &&
      !isConnected
    ) {
      helpers.showToast(i18n.t('global.error.noRecords'),true);
    }
    if (prevProps.error !== error && error) {
      helpers.showToast(i18n.t('global.error.noRecords'),true);
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }
  */

  const renderFooter = () => {
    return (
      <View style={styles.loadMoreFooterText}>
        {isConnected && state.offset + state.limit < totalGroups && (
          <TouchableOpacity
            onPress={() => {
              onRefresh(true);
            }}>
            <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRow = (group) => (
    <TouchableOpacity
      onPress={() => goToGroupDetailScreen(group)}
      style={styles.flatListItem}
      key={group.ID}>
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }}>
              {Object.prototype.hasOwnProperty.call(group, 'name') ? group.name : group.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.groupSubtitle,
                {
                  textAlign: 'left',
                },
              ]}>
              {groupSettings.fields.group_status.values[group.group_status]
                ? groupSettings.fields.group_status.values[group.group_status].label
                : ''}
              {groupSettings.fields.group_status.values[group.group_status] &&
              groupSettings.fields.group_type.values[group.group_type]
                ? ' • '
                : ''}
              {groupSettings.fields.group_type.values[group.group_type]
                ? groupSettings.fields.group_type.values[group.group_type].label
                : ''}
              {groupSettings.fields.group_type.values[group.group_type] && group.member_count
                ? ' • '
                : ''}
              {group.member_count ? group.member_count : ''}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: 'column',
              width: statusCircleSize,
              paddingTop: 0,
              marginTop: 'auto',
              marginBottom: 'auto',
            },
            isRTL ? { marginRight: 5 } : { marginLeft: 5 },
          ]}>
          <View
            style={{
              width: statusCircleSize,
              height: statusCircleSize,
              borderRadius: statusCircleSize / 2,
              backgroundColor: utils.getSelectorColor(group.group_status),
              marginTop: 'auto',
              marginBottom: 'auto',
            }}></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  const onRefresh = (increasePagination = false, returnFromDetail = false) => {
    let newState = {
      offset: increasePagination ? state.offset + state.limit : 0,
    };
    setState(
      (prevState) => {
        return returnFromDetail ? prevState : newState;
      },
      () => {
        let filter = {};
        // Add pagination on ONLINE mode
        if (isConnected) {
          filter = {
            offset: state.offset,
            limit: state.limit,
            sort: state.sort,
          };
        }
        if (state.filtered) {
          filter = {
            ...filter,
            filtered: true,
          };
          if (state.filterOption) {
            filter = {
              ...filter,
              ...state.filterOption,
              filterOption: true,
            };
          } else if (state.filterText) {
            filter = {
              ...filter,
              name: state.filterText,
              sort: 'name',
              filterText: true,
            };
          }
        }
        //getAllGroups(userData.domain, userData.token, filter);
        dispatch(getAll(domain, token, offset, limit, sort));
      },
    );
  };

  const goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      console.log('*** IF GROUP DATA ***');
      dispatch(
        updatePrevious([
          {
            groupId: parseInt(groupData.ID),
            onlyView: true,
            groupName: groupData.title,
          },
        ]),
      );
      // Detail
      navigation.navigate('GroupDetails', {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.title,
      });
      //onGoBack: () => onRefresh(false, true),
    } else {
      console.log('*** ELSE GROUP DATA = null  ***');
      dispatch(updatePrevious([]));
      // Create
      navigation.navigate('GroupDetails', {
        onlyView: true,
        onGoBack: () => onRefresh(false, true),
      });
    }
  };

  const selectOptionFilter = (selectedFilter) => {
    setState(
      {
        filtered: true,
        filterText: null,
        filterOption: selectedFilter,
      },
      () => {
        onRefresh(false);
      },
    );
  };

  const filterByText = utils.debounce((queryText) => {
    if (queryText.length > 0) {
      setState(
        {
          filtered: true,
          filterText: queryText,
          filterOption: null,
        },
        () => {
          onRefresh(false);
        },
      );
    } else {
      setState(
        {
          filtered: false,
          filterText: null,
          filterOption: null,
        },
        () => {
          onRefresh();
        },
      );
    }
  }, 750);

  const onLayout = (fabIndexFix) => {
    if (fabIndexFix !== state.fixFABIndex) {
      setState({
        fixFABIndex: fabIndexFix,
      });
    }
  };

  // TODO: why this FAB uses Native Base but Contacts does not?
  const FAB = () => {
    return (
      <Fab
        style={[{ backgroundColor: Colors.tintColor }, state.fixFABIndex ? { zIndex: -1 } : {}]}
        position="bottomRight"
        onPress={() => goToGroupDetailScreen()}>
        <Icon name="md-add" />
      </Fab>
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {!isConnected && <OfflineBar />}
        {/*
        <SearchBar
          filterConfig={groupFilters}
          onSelectFilter={selectOptionFilter}
          onTextFilter={filterByText}
          onClearTextFilter={filterByText}
          onLayout={onLayout}
          count={
            state.dataSourceGroups.length % 100 === 0
              ? `${state.dataSourceGroups.length}+`
              : state.dataSourceGroups.length
          }
        />
        <FlatList
          data={state.dataSourceGroups}
          renderItem={(item) => renderRow(item.item)}
          ItemSeparatorComponent={flatListItemSeparator}
          keyboardShouldPersistTaps="always"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.ID.toString()}
          style={{ backgroundColor: Colors.mainBackgroundColor }}
        />
        */}
        <FilterList
          settings={groupSettings}
          filterConfig={groupFilters}
          onSelectFilter={selectOptionFilter}
          onTextFilter={filterByText}
          onClearTextFilter={filterByText}
          onLayout={onLayout}
          //count={
          //  state.dataSourceGroups.length % 100 === 0
          //    ? `${state.dataSourceGroups.length}+`
          //    : state.dataSourceGroups.length
          //}
          //data={groups}
          data={null}
          renderRow={renderRow}
        />
        <FAB />
      </View>
    </Container>
  );
};

/*
GroupsScreen.propTypes = {
  isConnected: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllGroups: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
  groupSettings: PropTypes.shape({
    group_status: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
    group_type: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
    labelPlural: PropTypes.string,
  }),
};
GroupsScreen.defaultProps = {
  error: null,
  loading: false,
  groupSettings: null,
  isConnected: null,
};
*/
export default GroupsScreen;
