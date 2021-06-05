import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, RefreshControl, Text, View, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
// component library (native base)
// recommended by native base (https://docs.nativebase.io/Components.html#swipeable-multi-def-headref)
import { SwipeListView } from 'react-native-swipe-list-view';
// expo
// redux
import { useSelector } from 'react-redux';
// actions
// helpers/utils
import Colors from 'constants/Colors';
import i18n from 'languages';
import { showToast } from 'helpers';
// custom components
import SearchBar from 'components/SearchBar';

// Custom Hooks
import useSettings from 'hooks/useSettings.js';

// third-party components
// NOTE: native base does not have a skeleton component, and the SVG support is useful for future use
import ContentLoader, { Rect, Circle, Path } from 'react-content-loader/native';
// styles/assets
import { styles } from './FilterList.styles';

const FilterList = ({
  onRefresh,
  filterConfig,
  onSelectFilter,
  onTextFilter,
  onClearTextFilter,
  onLayout,
  loading,
  data,
  renderRow,
  renderSkeletonRow,
  renderHiddenRow,
  leftOpenValue,
  rightOpenValue,
  onRowDidOpen,
  onRowDidClose,
  footer,
}) => {
  // TODO: constants
  const statusCircleSize = 15;
  const SWIPE_BTN_WIDTH = 80;

  const windowWidth = useWindowDimensions().width;

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const [refreshing, setRefreshing] = useState(false);

  const { settings, error: settingsError } = useSettings();
  if (settingsError) showToast(settingsError.message, true);

  const _onRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  });

  // TODO: only auto-refresh is empty?
  /*
  useEffect(() => {
    _onRefresh();
  }, []);
  */

  const skeletons = Array(10)
    .fill('')
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));

  const renderDefaultSkeletonRow = (item) => {
    return (
      <ContentLoader
        rtl={isRTL}
        speed={3}
        width={windowWidth}
        height={77}
        viewBox={'0 ' + '0 ' + windowWidth + ' 80'}
        backgroundColor="#e7e7e7"
        foregroundColor="#b7b7b7">
        <Circle cx="385" cy="25" r="8" />
        <Rect x="10" y="20" rx="2" ry="2" width="150" height="8" />
        <Rect x="10" y="45" rx="2" ry="2" width="100" height="5" />
        <Circle cx="120" cy="47" r="2" />
        <Rect x="130" y="45" rx="2" ry="2" width="150" height="5" />
        <Rect x="0" y="75" rx="2" ry="2" width="400" height="1" />
      </ContentLoader>
    );
  };

  let listData = data;
  let renderItem = renderRow;
  let renderHiddenItem = renderHiddenRow;
  console.log('*** FILTER LIST ***');
  //console.log(listData);
  if (loading || listData === null) {
    listData = skeletons;
    console.log('*** SHOULD BE SKELETONS ***');
    renderHiddenItem = null;
    if (renderSkeletonRow === null) {
      console.log('*** ER, SHOULD BE *** DEFAULT *** SKELETONS ***');
      renderItem = renderDefaultSkeletonRow;
    } else {
      renderItem = renderSkeletonRow;
    }
  }

  const listItemSeparator = () => <View style={styles.listItemSeparator} />;

  // TODO: nicer placeholder and use translated text
  return (
    <>
      {listData?.length < 0 ? (
        <Text>Placeholder</Text>
      ) : (
        <>
          <SearchBar
            settings={settings}
            filterConfig={filterConfig}
            onSelectFilter={onSelectFilter}
            onTextFilter={onTextFilter}
            onClearTextFilter={onClearTextFilter}
            onLayout={onLayout}
          />
          <SwipeListView
            data={listData}
            renderItem={(item) => renderItem(item.item)}
            renderHiddenItem={(data, rowMap) =>
              renderHiddenItem ? renderHiddenItem(data, rowMap) : null
            }
            leftOpenValue={leftOpenValue}
            rightOpenValue={leftOpenValue}
            onRowDidOpen={(item) => {
              onRowDidOpen === undefined ? null : onRowDidOpen(item);
            }}
            onRowDidClose={(item) => {
              onRowDidClose === undefined ? null : onRowDidClose(item);
            }}
            ItemSeparatorComponent={listItemSeparator}
            //keyboardShouldPersistTaps="always"
            //keyExtractor={(item) => item.ID.toString()}
            //extraData={loading}
            //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}
            style={{ backgroundColor: Colors.mainBackgroundColor }}
            ListFooterComponent={footer}
          />
        </>
      )}
    </>
  );
};
/* TODO
FilterList.propTypes = {
};
*/
export default FilterList;
