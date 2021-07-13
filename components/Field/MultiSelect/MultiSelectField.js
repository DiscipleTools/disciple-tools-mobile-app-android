import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Label } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

import MultiSelect from 'components/MultiSelect';

import { styles } from './MultiSelectField.styles';

const MultiSelectField = ({ value, options, editing, onChange }) => {
  console.log('*** MULTISELECT FIELD RENDER ***');

  // - state.sources
  // - state.nonExistingSources
  /*
  const [state, setState] = useState({
    selectedItems,
    items,
    sources: [],
  });
  */

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

  /*
  const selectedItems = value?.values?.map(selectedItem => { 
    //console.log(`selectedItem: ${ JSON.stringify(selectedItem) }`)
    //return selectedItem;
    return {
      value: selectedItem?.value[0]?.toUpperCase() + selectedItem?.value?.substring(1)
    };
  });
  */
  const items = Object.keys(options).map((key) => {
    return options[key];
  });
  const selectedItems = [];
  value?.values.forEach((selectedItem) => {
    items.find((option) => {
      if (option?.key === selectedItem?.value) {
        console.log(`...push item: ${JSON.stringify(option)}...`);
        selectedItems.push(option);
      }
    });
  });
  const MultiSelectFieldEdit = () => {
    const addSelection = (newValue) => {
      //console.log(`........ADD SELECTION: ${ JSON.stringify(newValue) }`)
      //console.log(`........selectedItems: ${ JSON.stringify(selectedItems) }`)
      const exists = selectedItems.find((selectedItem) => selectedItem?.key === newValue?.key);
      if (!exists) onChange([...selectedItems, newValue]);
    };
    return (
      <MultiSelect
        items={items}
        selectedItems={selectedItems}
        onChange={onChange}
        customAddSelection={addSelection}
        //customRemoveSelection={removeSelection}
      />
    );
  };

  const MultiSelectFieldView = () => (
    <>
      {selectedItems.map((selectedItem) => (
        <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{selectedItem?.label}</Text>
      ))}
    </>
  );

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
