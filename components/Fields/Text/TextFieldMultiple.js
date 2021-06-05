import React, { Component } from 'react';
import { View, Text, StyleSheet, ViewPropTypes } from 'react-native';

import { Icon, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  removeIcon: {
    fontSize: 30,
    color: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  containerStyle: {
    alignSelf: 'stretch',
    marginVertical: 10,
    padding: 5,
    alignItems: 'flex-start',
  },
  formIconLabel: {
    width: 'auto',
  },
  input: {
    marginBottom: 50,
    marginLeft: 25,
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D9D5DC',
  },
});

class TextFieldMultiple extends Component {
  constructor(props) {
    super(props);
    const { items } = this.props;
    const existValues = (items || []).filter((value) => !value.delete);
    if (!existValues || !existValues.length || existValues[existValues.length - 1].value) {
      items.push({
        value: '',
      });
    }
    this.state = {
      values: props.items,
    };
  }

  onFieldChange(value, index) {
    const { values } = this.state;
    let isLast = true;
    for (let i = index + 1; i < values.length; i++) {
      isLast = values[i].delete;
      if (!isLast) {
        break;
      }
    }
    this.setState((prevState) => {
      const { values: prevValues } = prevState;
      prevValues[index].value = value;

      if (isLast && value.trim()) {
        prevValues.push({
          value: '',
        });
      }
      this.props.onChange(prevState);
      return {
        prevValues,
      };
    });
  }

  onRemoveField(index) {
    const { values } = this.state;
    let textField = values[index];

    // delete the selected item
    if (values[index].value) {
      textField = {
        key: textField.key,
        delete: true,
      };
      values[index] = textField;
    }

    // if all items are deleted, add a blank item
    const existValues = values.filter((value) => !value.delete);
    if (!existValues.length) {
      values.push({
        value: '',
      });
    }
    this.setState({
      values,
    });
    this.props.onChange(values, textField);
  }

  render = () => {
    const { containerStyle, textInputStyle, placeholder } = this.props;

    const textInput = this.state.values.map((inputValue, index) => {
      if (!inputValue.delete) {
        return (
          <Row key={index.toString()} style={styles.input}>
            <Input
              value={inputValue.value}
              placeholder={placeholder}
              onChangeText={(value) => {
                this.onFieldChange(value, index);
              }}
              style={[styles.textInputStyle, textInputStyle]}
            />
            <Col style={styles.formIconLabel}>
              <Icon
                android="md-remove"
                ios="ios-remove"
                onPress={() => {
                  this.onRemoveField(index);
                }}
                style={styles.removeIcon}
              />
            </Col>
          </Row>
        );
      }
      return null;
    });

    return (
      <View style={[styles.containerStyle, containerStyle]}>
        {textInput}
        <View style={styles.formDivider} />
      </View>
    );
  };
}

TextFieldMultiple.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  textInputStyle: Text.propTypes.style,
  // Config
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      value: PropTypes.string,
      delete: PropTypes.bool,
    }),
  ),
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextFieldMultiple.defaultProps = {
  containerStyle: null,
  textInputStyle: null,
  items: [],
  placeholder: null,
};
export default TextFieldMultiple;
