import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Label, Icon, DatePicker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// Custom Hooks

import i18n from 'languages';
import moment from 'languages/moment';
import utils from 'utils';

import { styles } from './DateField.styles';

const DateField = ({ value }) => {
  console.log('*** DATE FIELD RENDER ***');

  const [state, setState] = useState({
    date: value,
  });

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const formatDateToBackEnd = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month =
      dateObject.getMonth() + 1 < 10 ? `0${dateObject.getMonth() + 1}` : dateObject.getMonth() + 1;
    const day = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();
    const newDate = `${year}-${month}-${day}`;
    return newDate;
  };

  const formatDateToView = (date) => {
    return moment(new Date(date)).utc().format('LL');
  };

  const formatDateToDatePicker = (timestamp = null) => {
    let date = timestamp ? new Date(timestamp) : new Date();
    // Keep date value to current timezone
    date = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000 * Math.sign(date.getTimezoneOffset()),
    );
    return date;
  };

  const DateFieldEdit = () => {
    return (
      <Row>
        <DatePicker
          modalTransparent={true}
          //androidMode={"default"}
          maximumDate={new Date()}
          locale={'en'}
          onDateChange={(dateValue) => {
            /* TODO: lift up to save
            setState({
              ...state,
              date: formatDateToBackEnd(dateValue) ?? null
            });
            */
          }}
          defaultDate={formatDateToDatePicker(state.date * 1000)}
        />
        <Icon
          type="AntDesign"
          name="close"
          style={[
            styles.formIcon,
            styles.addRemoveIcons,
            styles.removeIcons,
            { marginLeft: 'auto' },
          ]}
          onPress={() => {
            /* TODO: lift up to save
            setState({
              ...state,
              date: null
            });
            */
          }}
        />
      </Row>
    );
  };

  const DateFieldView = () => {
    return <Text>{formatDateToView(utils.isNumeric(value) ? parseInt(value) * 1000 : value)}</Text>;
  };

  return <>{editing ? <DateFieldEdit /> : <DateFieldView />}</>;
};
export default DateField;
