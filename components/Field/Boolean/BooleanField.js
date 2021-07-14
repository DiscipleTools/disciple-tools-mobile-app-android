import React from 'react';

import useI18N from 'hooks/useI18N';

const BooleanField = ({ value, editing, onChange }) => {
  const { isRTL } = useI18N();

  // TODO: implement
  const BooleanFieldEdit = () => {
    return null;
  };

  // TODO: implement
  const BooleanFieldView = () => {
    return null;
  };

  return <>{editing ? <BooleanFieldEdit /> : <BooleanFieldView />}</>;
};
export default BooleanField;
