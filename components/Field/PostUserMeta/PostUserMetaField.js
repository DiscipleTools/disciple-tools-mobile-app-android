import React from 'react';

const PostUserMetaField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

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
