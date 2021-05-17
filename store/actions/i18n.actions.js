/*
 * Action Types
 */
export const I18N_SET_LOCALE = 'I18N_SET_LOCALE';

/*
 * Action Creators
 */
export function setLocale(locale) {
  return {
    type: I18N_SET_LOCALE,
    locale,
  };
}
