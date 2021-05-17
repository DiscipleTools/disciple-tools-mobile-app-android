import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View } from 'react-native';
import { Button } from 'native-base';
import { Row } from 'react-native-easy-grid';

import ActionModal from 'components/ActionModal';

import Colors from 'constants/Colors';
import i18n from 'languages';
import { setLocale } from 'store/actions/i18n.actions';

import { styles } from './Locale.styles';

const Locale = ({ state, setState }) => {
  const dispatch = useDispatch();

  const localeNew = state.locale;
  const localeObjNew = i18n.getLocaleObj(localeNew);
  const isRTLNew = localeObjNew.rtl;

  const localePrev = useSelector((state) => state.i18nReducer.locale);
  const isRTLPrev = useSelector((state) => state.i18nReducer.isRTL);

  const isRestartRequired =
    isRTLNew === isRTLPrev || isRTLNew === null || isRTLPrev === null ? false : true;

  const onCancel = () => {
    setState({
      ...state,
      locale: localePrev,
    });
  };

  const onConfirm = () => {
    dispatch(setLocale(localeNew));
  };

  const renderAppRestartModal = (
    <View style={styles.dialogBox}>
      <Text style={styles.dialogContent}>{i18n.t('appRestart.message', { localePrev })}</Text>
      <Text style={styles.dialogContent}>
        {i18n.t('appRestart.selectedLanguage', { localePrev }) + ': ' + localeObjNew.name}
      </Text>
      <Text style={styles.dialogContent}>
        {i18n.t('appRestart.textDirection', { localePrev }) + ': ' + (isRTLNew ? 'RTL' : 'LTR')}
      </Text>
      <Row style={{ height: 50 }}>
        <Button
          block
          style={[
            styles.dialogButton,
            {
              backgroundColor: '#ffffff',
              width: 120,
              marginLeft: 'auto',
              marginRight: 'auto',
            },
          ]}
          onPress={() => {
            onCancel();
          }}>
          <Text style={{ color: Colors.tintColor }}>{i18n.t('global.cancel', { localePrev })}</Text>
        </Button>
        <Button
          block
          style={[styles.dialogButton, { width: 120, marginLeft: 'auto', marginRight: 'auto' }]}
          onPress={() => {
            onConfirm();
          }}>
          <Text style={{ color: '#FFFFFF' }}>{i18n.t('appRestart.button', { localePrev })}</Text>
        </Button>
      </Row>
    </View>
  );
  if (!isRestartRequired) {
    // NOTE: if no restart is required (change from RTL->LTR or LTR->RTL), then simply
    // dispatch the locale update and return null (to not render anything)
    dispatch(setLocale(localeNew));
    return null;
  }
  return (
    <ActionModal
      visible={isRestartRequired}
      onClose={(visible) => {
        onCancel();
      }}
      title={i18n.t('appRestart.modalTitle', { localePrev })}>
      {renderAppRestartModal}
    </ActionModal>
  );
};
export default Locale;
