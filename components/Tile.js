import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, RefreshControl } from 'react-native';

// Custom Components
import Field from 'components/Field/Field';

const Tile = ({ post, fields, save, mutate }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    mutate();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const currentlyUnsupportedFieldFilter = (field) => {
    //return field.name !== '??';
    return field;
  };

  /*
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      extraScrollHeight={75}
    >
  */
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <KeyboardAvoidingView
        //behavior={Platform.OS === "ios" ? "padding" : "height"}
        behavior="position"
        style={{ flex: 1 }}
        // required so top-most field is not hidden by tab bar in edit mode
        keyboardVerticalOffset={-100}>
        {fields
          .filter((field) => currentlyUnsupportedFieldFilter(field))
          .map((field) => (
            <Field post={post} field={field} save={save} />
          ))}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
export default Tile;
