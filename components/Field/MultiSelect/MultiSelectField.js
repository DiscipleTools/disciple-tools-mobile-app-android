import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Label } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

import MultiSelect from 'components/MultiSelect';

import { styles } from './MultiSelectField.styles';

const MultiSelectField = ({ field, value, editing, onChange }) => {
  //TODO:
  const items = [
    {
      key: 1,
      label: 'Jane Doe',
    },
    {
      key: 2,
      label: 'Timmy Testerton',
    },
    {
      key: 3,
      label: 'Janice Doe',
    },
    {
      key: 4,
      label: 'Tammy Testerton',
    },
  ];
  const selectedItems = [
    {
      key: 2,
      label: 'Timmy Testerton',
    },
    {
      key: 4,
      label: 'Tammy Testerton',
    },
  ];

  console.log('*** MULTISELECT FIELD RENDER ***');

  // - state.sources
  // - state.nonExistingSources
  const [state, setState] = useState({
    selectedItems,
    items,
    sources: [],
  });

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const onMilestoneChange = (milestoneName, customProp = null) => {
    /* TODO: record?
    let list = customProp ? record[customProp] : record.milestones;
    let propName = customProp ? customProp : 'milestones';
    const milestonesList = list ? [...list.values] : [];
    const foundMilestone = milestonesList.find((milestone) => milestone.value === milestoneName);
    if (foundMilestone) {
      const milestoneIndex = milestonesList.indexOf(foundMilestone);
      if (foundMilestone.delete) {
        const milestoneModified = {
          ...foundMilestone,
        };
        delete milestoneModified.delete;
        milestonesList[milestoneIndex] = milestoneModified;
      } else {
        milestonesList[milestoneIndex] = {
          ...foundMilestone,
          delete: true,
        };
      }
    } else {
      milestonesList.push({
        value: milestoneName,
      });
    }
    // TODO:
    /*
    setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [propName]: {
          values: milestonesList,
        },
      },
      group: {
        ...prevState.group,
        [propName]: {
          values: milestonesList,
        },
      },
    }));
    */
  };

  const onCheckExistingMilestone = (milestoneName, customProp = null) => {
    /* TODO: record?
    let list = customProp ? record[customProp] : record.milestones;
    const milestonesList = list ? [...list.values] : [];
    // Return 'boolean' acording to milestone existing in the 'milestonesList'
    return milestonesList.some(
      (milestone) => milestone.value === milestoneName && !milestone.delete,
    );
    */
  };

  const renderMultiSelectField = (field, value, index) => (
    <TouchableOpacity
      key={index.toString()}
      onPress={() => {
        if (editing) {
          onMilestoneChange(value, field.name);
        }
      }}
      activeOpacity={1}
      underlayColor={onCheckExistingMilestone(value, field.name) ? Colors.tintColor : Colors.gray}
      style={{
        borderRadius: 10,
        backgroundColor: onCheckExistingMilestone(value, field.name)
          ? Colors.tintColor
          : Colors.gray,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
      }}>
      <Text
        style={[
          styles.progressIconText,
          {
            color: onCheckExistingMilestone(value, field.name) ? '#FFFFFF' : '#000000',
          },
        ]}>
        {field.default[value].label}
      </Text>
    </TouchableOpacity>
  );

  const ZZMultiSelectFieldEdit = () => {
    if (field.name == 'sources') {
      return (
        <Selectize
          itemId="value"
          items={state.sources}
          selectedItems={
            value
              ? // Only add option elements (by contact sources) does exist in source list
                value.values
                  .filter((contactSource) =>
                    state.sources.find((sourceItem) => sourceItem.value === contactSource.value),
                  )
                  .map((contactSource) => {
                    return {
                      name: state.sources.find(
                        (sourceItem) => sourceItem.value === contactSource.value,
                      ).name,
                      value: contactSource.value,
                    };
                  })
              : []
          }
          textInputProps={{
            placeholder: '',
          }}
          renderRow={(id, onPress, item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={id}
              onPress={onPress}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: 14,
                    lineHeight: 21,
                  }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderChip={(id, onClose, item, style, iconStyle) => (
            <Chip
              key={id}
              iconStyle={iconStyle}
              onClose={(props) => {
                const nonExistingSourcesList = [...state.nonExistingSources];
                let foundNonExistingSource = nonExistingSourcesList.findIndex(
                  (source) => source.value === id,
                );
                if (foundNonExistingSource > -1) {
                  // Remove custom source from select list
                  const sourceList = [...state.sources]; //,
                  let foundSourceIndex = sourceList.findIndex((source) => source.value === id);
                  sourceList.splice(foundSourceIndex, 1);
                  setState({
                    ...state,
                    sources: [...sourceList],
                  });
                }
                onClose(props);
              }}
              text={item.name}
              style={style}
            />
          )}
          filterOnKey="name"
          onChangeSelectedItems={(selectedItems) =>
            onSelectizeValueChange(field.name, selectedItems)
          }
          inputContainerStyle={styles.selectizeField}
        />
      );
    } else if (field.name == 'milestones') {
      return (
        <Col style={{ paddingBottom: 15 }}>
          <Row style={[styles.formRow, { paddingTop: 10 }]}>
            <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
              <Icon type="Octicons" name="milestone" style={styles.formIcon} />
            </Col>
            <Col>
              <Label
                style={[
                  styles.formLabel,
                  { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                  isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {field.label}
              </Label>
            </Col>
          </Row>
          {/* TODO
          <FaithMilestones state={state} />
          <FaithMilestones state={state} custom />
          */}
        </Col>
      );
    } else if (field.name == 'health_metrics') {
      return (
        <View>
          <Row style={[styles.formRow, { paddingTop: 10 }]}>
            <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
              <Icon type="MaterialCommunityIcons" name="church" style={[styles.formIcon, {}]} />
            </Col>
            <Col>
              <Label style={[styles.formLabel, { fontWeight: 'bold' }]}>
                {groupSettings.fields.health_metrics.name}
              </Label>
            </Col>
          </Row>
          {/* TODO: merge <FaithMilestones> and <HealthMilestones> */}
          {renderHealthMilestones()}
          {renderCustomHealthMilestones()}
        </View>
      );
    } else {
      return (
        <Row style={{ flexWrap: 'wrap' }}>
          {Object.keys(field.default).map((value, index) =>
            renderMultiSelectField(field, value, index),
          )}
        </Row>
      );
    }
  };

  const MultiSelectFieldEdit = () => (
    <MultiSelect
      items={items}
      selectedItems={selectedItems}
      onChange={onChange}
      placeholder={'zzzzz'}
    />
  );

  const MultiSelectFieldView = () => (
    <>
      {value.values.map((tag) => (
        <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{tag.value}</Text>
      ))}
    </>
  );

  const ZZMultiSelectFieldView = () => {
    return (
      <Row>
        <Col style={[styles.container, styles.containerStyle]}>
          <Selectize
            itemId="value"
            items={state.items}
            selectedItems={state.selectedItems}
            //TODO:textInputProps={{
            //  placeholder,
            //}}
            renderRow={(id, onPress, item) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={id}
                onPress={onPress}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: 'rgba(0, 0, 0, 0.87)',
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            renderChip={(id, onClose, item, style, iconStyle) => (
              <Chip
                key={id}
                iconStyle={iconStyle}
                onClose={onClose}
                text={item.label}
                style={style}
              />
            )}
            filterOnKey="name"
            keyboardShouldPersistTaps
            inputContainerStyle={[styles.inputContainer, styles.inputContainerStyle]}
          />
        </Col>
      </Row>
    );
  };

  return <>{editing ? <MultiSelectFieldEdit /> : <MultiSelectFieldView />}</>;
};
/*
      if (field.name == 'milestones') {
        return (
          <Col style={{ paddingBottom: 15 }}>
            <Row style={[styles.formRow, { paddingTop: 10 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Icon type="Octicons" name="milestone" style={styles.formIcon} />
              </Col>
              <Col>
                <Label
                  style={[
                    styles.formLabel,
                    { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                    isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  {field.label}
                </Label>
              </Col>
            </Row>
            <FaithMilestones state={state} />
            <FaithMilestones state={state} custom />
          </Col>
        );
      } else if (field.name == 'sources') {
        return (
          <Text
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}>
            value.values
              .map(
                (source) =>
                  state.sources.find((sourceItem) => sourceItem.value === source.value).name,
              )
              .join(', ')
            {value.values.join(', ')}
          </Text>
        );
      } else if (field.name == 'health_metrics') {
        return (
          <View>
            <Row style={[styles.formRow, { paddingTop: 10 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Icon type="MaterialCommunityIcons" name="church" style={[styles.formIcon, {}]} />
              </Col>
              <Col>
                <Label style={[styles.formLabel, { fontWeight: 'bold' }]}>
                  {settings.fields.health_metrics.name}
                </Label>
              </Col>
            </Row>
            renderHealthMilestones()
            renderCustomHealthMilestones()
          </View>
        );
      } else {
        return (
          <Row style={{ flexWrap: 'wrap' }}>
            {Object.keys(field.default).map((value, index) =>
              renderMultiSelectField(field, value, index),
            )}
          </Row>
        );
      }
*/

/*
MultiSelect.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: Text.propTypes.style,
  // Config
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  placeholder: PropTypes.string,
};

MultiSelect.defaultProps = {
  containerStyle: null,
  inputContainerStyle: null,
  items: [],
  selectedItems: [],
  placeholder: null,
};
*/
export default MultiSelectField;
