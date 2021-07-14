import { Toast } from 'native-base';

import useI18N from 'hooks/useI18N';

const useToast = () => {
  const { i18n } = useI18N();

  // NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
  const DEFAULT_WAIT = 500;
  const toast = (message, error = false) => {
    if (error) {
      const text = `${i18n.t('global.error.text')} ${message}`;
      setTimeout(() => {
        Toast.show({
          text,
          duration: 5000,
          type: 'danger',
        });
      }, DEFAULT_WAIT);
    } else {
      setTimeout(() => {
        Toast.show({
          text: message,
          duration: 3000,
        });
      }, DEFAULT_WAIT);
    }
  };
  // TODO: fns for: toastSuccess, toastError, toastErrorGeneric ??
  return toast;
};
export default useToast;
