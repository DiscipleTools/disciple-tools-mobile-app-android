import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'native-base';
import { Row } from 'react-native-easy-grid';

import useI18N from 'hooks/useI18N';
import ActionModal from 'components/ActionModal';

// TODO: move to StyleSheet
import Colors from 'constants/Colors';

import { styles } from './Locale.styles';

const Locale = ({ state, setState }) => {
  const dispatch = useDispatch();
  const { i18n, isRTL: isRTLPrev, locale: localePrev, setLocale } = useI18N();

  const localeNew = state.locale;
  const localeObjNew = i18n.getLocaleObj(localeNew);
  const isRTLNew = localeObjNew.rtl;

  const isRestartRequired =
    isRTLNew === isRTLPrev || isRTLNew === null || isRTLPrev === null ? false : true;

  const onCancel = () => {
    setState({
      ...state,
      locale: localePrev,
    });
  };

  const onConfirm = () => {
    // TODO: useSetLocale
    //dispatch(setLocale(localeNew));
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
