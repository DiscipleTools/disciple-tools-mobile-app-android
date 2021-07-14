import { useDispatch, useSelector } from 'react-redux';
//import setLocale from 'store/actions/i18n.actions';

import i18n from 'languages';
import moment from 'languages/moment';

const useI18N = () => {
  //const dispatch = useDispatch();
  const locale = useSelector((state) => state.i18nReducer.locale);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  /*
  const setLocale = (locale) => {
    dispatch(setLocale(locale));
  };
  */
  moment.locale(locale);
  // TODO: ??
  // moment.locale(locale);
  //if (!locale) goFetch
  return {
    i18n,
    locale,
    isRTL,
    moment,
    //setLocale,
  };
};
export default useI18N;
