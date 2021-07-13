import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View, RefreshControl } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <KeyboardAvoidingView
        //behavior={Platform.OS === "ios" ? "padding" : "height"}
        behavior="position"
        style={{ flex: 1 }}
        // required so top-most field is not hidden by tab bar in edit mode
        //keyboardVerticalOffset={-100}
        keyboardVerticalOffset={-150}
      >
  */
  return (
    <KeyboardAwareScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      extraScrollHeight={75}
      keyboardShouldPersistTaps="handled">
      {fields
        .filter((field) => currentlyUnsupportedFieldFilter(field))
        .map((field) => (
          <Field post={post} field={field} save={save} />
        ))}
    </KeyboardAwareScrollView>
  );
};
export default Tile;
