import React from 'react';
import { View } from 'react-native';

// Custom Components
import Field from 'components/Field/Field';

import { styles } from './Tile.styles';

const Tile = ({ post, fields, save }) => (
  <View style={styles.background}>
    {fields
      //.filter((field) => field.name !== '??')
      .map((field) => (
        <Field post={post} field={field} save={save} />
      ))}
  </View>
);
export default Tile;
