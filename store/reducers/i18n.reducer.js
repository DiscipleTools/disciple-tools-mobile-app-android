import * as actions from 'store/actions/i18n.actions';

import * as Updates from 'expo-updates';

import i18n from 'languages';

const initialState = {
  locale: null,
  isRTL: null,
};

export default function i18nReducer(state = initialState, action) {
  switch (action.type) {
    case actions.I18N_SET_LOCALE:
      const localeObj = i18n.setLocale(action.locale);
      if (localeObj.rtl !== state.isRTL) {
        // TODO: move to Saga with delay and then Reduce ON_SUCCESS?
        // NOTE: This is obviously less than ideal bc we are guessing about how long to give Redux Persist time to write global state to AsyncStorage (so it is available upon App Restart). Unfotunately, 'try/finally' does not work bc the delay is not long enough.  It is for the same reason that we do not move this to a Saga, bc we need to ensure that the Redux State reduces and persists prior to App Restart.
        setTimeout(() => {
          Updates.reloadAsync();
        }, 1000);
      }
      return {
        ...state,
        locale: localeObj.code,
        isRTL: localeObj.rtl,
      };
    default:
      return state;
  }
}
