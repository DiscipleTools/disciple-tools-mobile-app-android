import React from 'react';

import useI18N from 'hooks/useI18N';

const PostUserMetaField = ({ value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  // TODO: implement
  const PostUserMetaFieldEdit = () => {
    return null;
  };

  // TODO: implement
  const PostUserMetaFieldView = () => {
    return null;
  };

  return <>{editing ? <PostUserMetaFieldEdit /> : <PostUserMetaFieldView />}</>;
};
export default PostUserMetaField;
