import React from 'react';
import { Text } from 'react-native';
import { Icon, DatePicker } from 'native-base';
import { Row } from 'react-native-easy-grid';

import useI18N from 'hooks/useI18N';

import utils from 'utils';

import { styles } from './DateField.styles';

const DateField = ({ value, editing, onChange }) => {
  const { i18n, locale, isRTL, moment } = useI18N();

  const handleChange = (newValue) => {
    let parsedValue = null;
    if (newValue) parsedValue = Date.parse(newValue) / 1000;
    if (parsedValue !== null && parsedValue !== value) {
      const day = moment(newValue).date();
      const month = moment(newValue).month();
      const year = moment(newValue).year();
      console.log(`yyyy-mm-dd: ${year}-${month}-${day}`);
      onChange(parsedValue);
    }
  };

  const DateFieldEdit = () => {
    const formatDateEdit = (timestamp = null) => {
      if (!timestamp) return null;
      let date = timestamp ? new Date(timestamp) : new Date();
      // Keep date value to current timezone
      date = new Date(
        date.getTime() + date.getTimezoneOffset() * 60 * 1000 * Math.sign(date.getTimezoneOffset()),
      );
      return date;
    };
    const defaultDate = formatDateEdit(value * 1000);
    return (
      <Row>
        <DatePicker
          modalTransparent={false}
          //androidMode={"default"}
          maximumDate={new Date()}
          locale={locale}
          //timeZoneOffsetInMinutes={undefined}
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
  };

  const DateFieldView = () => {
    const formatDateView = (date) => {
      return moment(new Date(date * 1000))
        .utc()
        .format('LL');
    };
    const dateValue = String(
      formatDateView(utils.isNumeric(value) ? parseInt(value) * 1000 : value),
    );
    return <Text>{dateValue}</Text>;
  };

  return <>{editing ? <DateFieldEdit /> : <DateFieldView />}</>;
};
export default DateField;
