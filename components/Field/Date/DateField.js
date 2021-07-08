import React from 'react';
import { Text } from 'react-native';
import { Icon, DatePicker } from 'native-base';
import { Row } from 'react-native-easy-grid';

// Helpers
import i18n from 'languages';
import moment from 'languages/moment';
import { showToast } from 'helpers';
import utils from 'utils';

import { styles } from './DateField.styles';

const DateField = ({ value, editing, onChange }) => {
  const handleChange = (newValue) => {
    let parsedValue = null;
    if (newValue) parsedValue = Date.parse(newValue) / 1000;
    if (parsedValue !== value) onChange(parsedValue);
  };

  // TODO: how to return this to Field.js properly
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

  // TODO: use locale with timezone?
  const formatDateToDatePicker = (timestamp = null) => {
    if (!timestamp) return null;
    let date = timestamp ? new Date(timestamp) : new Date();
    // Keep date value to current timezone
    date = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000 * Math.sign(date.getTimezoneOffset()),
    );
    return date;
  };

  const defaultDate = formatDateToDatePicker(value * 1000);
  const DateFieldEdit = () => (
    <Row>
      <DatePicker
        modalTransparent={false} //true}
        //androidMode={"default"}
        maximumDate={new Date()}
        locale={'en'} // TODO: use locale
        onDateChange={handleChange}
        defaultDate={defaultDate}
      />
      <Icon
        type="AntDesign"
        name="close"
        style={[
          styles.formIcon,
          styles.addRemoveIcons,
          styles.removeIcons,
          //{ marginLeft: 'auto' },
        ]}
        onPress={() => handleChange(null)}
      />
    </Row>
  );

  const DateFieldView = () => {
    return <Text>{formatDateToView(utils.isNumeric(value) ? parseInt(value) * 1000 : value)}</Text>;
  };

  return <>{editing ? <DateFieldEdit /> : <DateFieldView />}</>;
};
export default DateField;
