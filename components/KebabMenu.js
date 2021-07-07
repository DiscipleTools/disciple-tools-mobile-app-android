import React, { useRef } from 'react';
import { Icon } from 'native-base';
import Menu, { MenuItem } from 'react-native-material-menu';

import { styles } from './KebabMenu.styles';

const KebabMenu = ({ menuItems }) => {
  const menuRef = useRef();
  return (
    <Menu
      ref={menuRef}
      button={
        <Icon
          type="Entypo"
          name="dots-three-vertical"
          onPress={() => menuRef.current.show()}
          style={styles.kebabMenu}
        />
      }>
      {menuItems?.map((menuItem) => (
        <MenuItem
          onPress={() => {
            menuItem.callback();
            menuRef.current.hide();
          }}>
          {menuItem.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
export default KebabMenu;
