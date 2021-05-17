import React from 'react';
import { Icon } from 'native-base';
import Menu, { MenuItem } from 'react-native-material-menu';
import Colors from 'constants/Colors';

const KebabMenu = ({ menuRef, menuItems }) => {
  return (
    <Menu
      ref={menuRef}
      button={
        <Icon
          type="Entypo"
          name="dots-three-vertical"
          style={{
            color: Colors.headerTintColor,
            fontSize: 20,
          }}
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
