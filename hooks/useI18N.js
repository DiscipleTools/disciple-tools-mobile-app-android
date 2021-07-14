import { useDispatch, useSelector } from 'react-redux';
import { Picker } from 'native-base';
//import setLocale from 'store/actions/i18n.actions';

import i18n from 'languages';
import locales from 'languages/locales';
import moment from 'languages/moment';

const useI18N = () => {
  //const dispatch = useDispatch();
  const locale = useSelector((state) => state.i18nReducer.locale);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const setLocale = (locale) => {
    //dispatch(setLocale(locale));
    return locale;
  };

  moment.locale(locale);
  // TODO: ??
  // moment.locale(locale);
  //if (!locale) goFetch

  const LanguagePickerItems = () => (
    <>
      {locales.map((locale) => (
        <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
      ))}
    </>
  );

  return {
    i18n,
    isRTL,
    locale,
    moment,
    setLocale,
    LanguagePickerItems,
  };
};
export default useI18N;
