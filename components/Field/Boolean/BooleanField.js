import React from 'react';

const BooleanField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

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
