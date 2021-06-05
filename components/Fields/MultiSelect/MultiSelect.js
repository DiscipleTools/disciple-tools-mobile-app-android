import React, { Component } from 'react';
import { View, Text, StyleSheet, ViewPropTypes, TouchableOpacity } from 'react-native';
import { Chip, Selectize } from 'react-native-material-selectize';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 5,
  },
});

class MultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: this.props.selectedItems,
      items: this.props.items,
    };
  }

  render = () => {
    const { containerStyle, inputContainerStyle, placeholder } = this.props;

    return (
      <Row>
        <Col style={[styles.container, containerStyle]}>
          <Selectize
            itemId="value"
            items={this.state.items}
            selectedItems={this.state.selectedItems}
            textInputProps={{
              placeholder,
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
            inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
          />
        </Col>
      </Row>
    );
  };
}

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
export default MultiSelect;
