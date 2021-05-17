import React from 'react';
import { Icon } from 'native-base';
import Colors from 'constants/Colors';

const FieldIcon = ({ field, detailMode, hideIcon }) => {
  let iconType = '';
  let iconName = '';
  switch (field.type) {
    case 'location': {
      iconType = 'FontAwesome';
      iconName = 'map-marker';
      break;
    }
    case 'date': {
      if (field.name.includes('church_start_date')) {
        iconType = 'FontAwesome';
        iconName = 'calendar-check-o';
      } else if (field.name.includes('post_date')) {
        iconType = 'FontAwesome';
        iconName = 'calendar-o';
      } else if (field.name.includes('start')) {
        iconType = 'FontAwesome';
        iconName = 'calendar-plus-o';
      } else if (field.name.includes('end')) {
        iconType = 'FontAwesome';
        iconName = 'calendar-times-o';
      } else {
        iconType = 'FontAwesome';
        iconName = 'calendar';
      }
      break;
    }
    case 'connection': {
      if (field.name.includes('subassigned')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'briefcase-account-outline';
      } else if (field.name.includes('relation')) {
        iconType = 'FontAwesome5';
        iconName = 'people-arrows';
      } else if (field.name.includes('people_groups')) {
        iconType = 'FontAwesome';
        iconName = 'globe';
      } else if (field.name.includes('coach')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'teach';
      } else if (field.name.includes('bapti')) {
        iconType = 'FontAwesome5';
        iconName = 'water';
      } else if (field.name.includes('group')) {
        iconType = 'MaterialIcons';
        iconName = 'groups';
      } else if (field.name.includes('train')) {
        iconType = 'FontAwesome5';
        iconName = 'chalkboard-teacher';
      } else if (field.name.includes('members')) {
        iconType = 'FontAwesome5';
        iconName = 'list-ol';
      } else if (field.name.includes('leaders')) {
        iconType = 'FontAwesome';
        iconName = 'globe';
      } else {
        iconType = 'MaterialIcons';
        iconName = 'group-work';
      }
      break;
    }
    case 'multi_select': {
      if (field.name.includes('tag')) {
        iconType = 'AntDesign';
        iconName = 'tags';
      } else if (field.name.includes('email')) {
        iconType = 'FontAwesome';
        iconName = 'envelope';
      } else if (field.name.includes('sources')) {
        iconType = 'FontAwesome5';
        iconName = 'compress-arrows-alt';
      } else if (field.name.includes('health_metrics')) {
        iconType = 'FontAwesome5';
        iconName = 'tachometer-alt';
      } else {
        iconType = 'Ionicons';
        iconName = 'list-circle';
      }
      break;
    }
    case 'communication_channel': {
      if (field.name.includes('phone')) {
        iconType = 'FontAwesome';
        iconName = 'phone';
      } else if (field.name.includes('email')) {
        iconType = 'FontAwesome';
        iconName = 'envelope';
      } else if (field.name.includes('twitter')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'twitter';
      } else if (field.name.includes('facebook')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'facebook';
      } else if (field.name.includes('instagram')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'instagram';
      } else if (field.name.includes('whatsapp')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'whatsapp';
      } else if (field.name.includes('address')) {
        iconType = 'FontAwesome5';
        iconName = 'directions';
      } else {
        iconType = 'Feather';
        iconName = 'hash';
      }
      break;
    }
    case 'key_select': {
      if (field.name.includes('faith_status')) {
        iconType = 'FontAwesome5';
        iconName = 'cross';
      } else if (field.name.includes('seeker_path')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'map-marker-path';
      } else if (field.name.includes('gender')) {
        iconType = 'FontAwesome5';
        iconName = 'transgender';
      } else if (field.name.includes('age')) {
        iconType = 'FontAwesome5';
        iconName = 'user-clock';
      } else if (field.name.includes('group_status')) {
        iconType = 'FontAwesome5';
        iconName = 'crosshairs';
      } else if (field.name.includes('group_type')) {
        iconType = 'Entypo';
        iconName = 'hair-cross';
      } else if (field.name.includes('group')) {
        iconType = 'FontAwesome';
        iconName = 'crosshairs';
      } else {
        iconType = 'Ionicons';
        iconName = 'list-circle';
      }
      break;
    }
    case 'user_select': {
      if (field.name.includes('assigned_to')) {
        iconType = 'MaterialCommunityIcons';
        iconName = 'briefcase-account';
      } else {
        iconType = 'FontAwesome';
        iconName = 'user';
      }
      break;
    }
    case 'text': {
      if (field.name.includes('nickname')) {
        iconType = 'FontAwesome5';
        iconName = 'user-tag';
      } else if (field.name.includes('four_fields')) {
        iconType = 'FontAwesome5';
        iconName = 'dice-four';
      } else if (field.name.includes('name')) {
        iconType = 'FontAwesome5';
        iconName = 'user-alt';
      } else {
        iconType = 'Entypo';
        iconName = 'text';
      }
      break;
    }
    case 'number': {
      if (field.name.includes('leader')) {
        iconType = 'FontAwesome5';
        iconName = 'hashtag';
      } else {
        iconType = 'Feather';
        iconName = 'hash';
      }
      break;
    }
    default: {
      iconType = 'MaterialCommunityIcons';
      iconName = 'square-small';
      break;
    }
  }
  return (
    <Icon
      type={iconType}
      name={iconName}
      style={[
        {
          color: Colors.tintColor,
          fontSize: 22,
          marginTop: 'auto',
          marginBottom: 'auto',
          width: 25,
        },
        detailMode ? { marginTop: 0 } : {},
        hideIcon ? { opacity: 0 } : {},
      ]}
    />
  );
};
export default FieldIcon;
