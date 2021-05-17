import { I18nManager } from 'react-native';
import i18n from 'i18n-js';
// This import is added to enable momentJS library (do not delete)
import moment from './moment';
import locales from './locales';

import * as en from './en.json';
import * as ar from './ar.json';
import * as bn from './bn.json';
import * as de from './de.json';
import * as es from './es.json';
import * as fr from './fr.json';
import * as hi from './hi.json';
import * as id from './id.json';
import * as ja from './ja.json';
import * as my from './my.json';
import * as nl from './nl.json';
import * as ptBR from './pt.json';
import * as mk from './mk.json';
import * as bs from './bs.json';
import * as hr from './hr.json';
import * as ro from './ro.json';
import * as sl from './sl.json';
import * as sr from './sr.json';
import * as ru from './ru.json';
import * as sw from './sw.json';
import * as th from './th.json';
import * as tl from './tl.json';
import * as tr from './tr.json';
import * as vi from './vi.json';
import * as zhCn from './zhCn.json';
import * as zhTw from './zhTw.json';
import * as fa from './fa.json';

// Locale codes names as expo-localization -> Localization.locale format (device)
i18n.translations = {
  'en-US': en,
  ar,
  'bn-BD': bn,
  'es-ES': es,
  'de-DE': de,
  'fa-IR': fa,
  'fr-FR': fr,
  hi,
  'id-ID': id,
  ja,
  'my-MM': my,
  'nl-NL': nl,
  'pt-BR': ptBR,
  mk,
  'bs-BA': bs,
  hr,
  'ro-RO': ro,
  'sl-SI': sl,
  'sr-BA': sr,
  'ru-RU': ru,
  sw,
  th,
  tl,
  'tr-TR': tr,
  vi,
  'zh-CN': zhCn,
  'zh-TW': zhTw,
};
i18n.defaultLocale = 'en-US';
i18n.fallbacks = true;
// Set fallback chain
i18n.locales.es = ['es-ES'];
//i18n.locales.es = ["es-419","es-ES","es-MX","es-AR","es-CO"];
i18n.locales.pt = ['pt-BR'];
//i18n.locales.pt = ["pt-BR","pt-PT"];
i18n.locales.zh = ['zh-CN', 'zh-TW'];

// expecting format "en-US"
// TODO: add unit tests!!
i18n.getLocaleObj = function getLocaleObj(locale) {
  if (locale === null || locale === undefined) {
    const defaultCode = i18n.defaultLocale.toString();
    localeObj = locales.find((item) => {
      return item.code === defaultCode;
    });
    return localeObj;
  }
  const locale_p = locale.replace('_', '-');
  let localeObj = locales.find((item) => {
    return item.code === locale_p;
  });
  if (localeObj !== undefined) {
    return localeObj;
  } else {
    if (locale_p.length && locale_p.length > 1) {
      const subcode = locale_p.substring(0, 2);
      if (i18n.locales.hasOwnProperty(subcode)) {
        const subLangCodes = i18n.locales[subcode];
        for (var ii = 0; ii < subLangCodes.length; ii++) {
          const subLangCode = subLangCodes[ii];
          localeObj = locales.find((item) => {
            return item.code === subLangCode;
          });
          if (localeObj !== null) break;
        }
      }
    } else {
      // TODO: duplicate, add function
      const defaultCode = i18n.defaultLocale.toString();
      localeObj = locales.find((item) => {
        return item.code === defaultCode;
      });
    }
    return localeObj;
  }
};

// use I18nManager.forceRTL(bool) prior to restarting the app
i18n.setLocale = function setLocale(languageCode) {
  const localeObj = this.getLocaleObj(languageCode);
  const locale = localeObj.code;
  const isRTL = localeObj.rtl;
  this.locale = locale;
  // Enable/Disable RTL
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  // Update momentJS locale
  let momentLocale =
    locale.substring(0, 2) === 'zh' ? locale.toLowerCase() : locale.substring(0, 2);
  moment.locale(momentLocale);
  return localeObj;
};

export default i18n;
