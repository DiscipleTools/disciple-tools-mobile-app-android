import i18n from '.';
const locale = 'id-ID';

describe('languages/' + locale, () => {
  beforeAll(() => i18n.setLocale(locale, false));

  test('test missing translation', () => {
    expect(i18n.t('global.zz')).toEqual('[missing "' + locale + '.global.zz" translation]');
  });

  test('test global.success.save translation', () => {
    expect(i18n.t('global.success.save')).toEqual('Data berhasil disimpan!');
  });
});