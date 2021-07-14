import React from 'react';
import { Text, View } from 'react-native';
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import useI18N from 'hooks/useI18N';
import useSettings from 'hooks/useSettings';

import { defaultFaithMilestones } from 'constants';

// TODO: refactor styles
import { styles } from './FaithMilestones.styles';

const FaithMilestones = ({ state, custom }) => {
  const { i18n, isRTL } = useI18N();
  const { settings: contactSettings } = useSettings();

  const renderCustomFaithMilestones = () => {
    const milestoneList = Object.keys(contactSettings.fields.milestones.values);
    const customMilestones = milestoneList.filter(
      (milestoneItem) => defaultFaithMilestones.indexOf(milestoneItem) < 0,
    );
    const rows = [];
    let columnsByRow = [];
    customMilestones.forEach((value, index) => {
      if ((index + 1) % 3 === 0 || index === customMilestones.length - 1) {
        // every third milestone or last milestone
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        columnsByRow.push(
          <Col key={columnsByRow.length} size={5}>
            <TouchableOpacity
              onPress={() => {
                onMilestoneChange(value);
              }}
              activeOpacity={1}
              underlayColor={onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray}
              style={{
                borderRadius: 10,
                backgroundColor: onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: onCheckExistingMilestone(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {contactSettings.fields.milestones.values[value].label}
              </Text>
            </TouchableOpacity>
          </Col>,
        );
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        rows.push(
          <Row key={`${index.toString()}-1`} size={1}>
            <Text> </Text>
          </Row>,
        );
        rows.push(
          <Row key={index.toString()} size={7}>
            {columnsByRow}
          </Row>,
        );
        columnsByRow = [];
      } else if ((index + 1) % 3 !== 0) {
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        columnsByRow.push(
          <Col key={columnsByRow.length} size={5}>
            <TouchableHighlight
              onPress={() => {
                onMilestoneChange(value);
              }}
              activeOpacity={1}
              underlayColor={onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray}
              style={{
                borderRadius: 10,
                backgroundColor: onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: onCheckExistingMilestone(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {contactSettings.fields.milestones.values[value].label}
              </Text>
            </TouchableHighlight>
          </Col>,
        );
      }
    });
    return <Grid pointerEvents={state.onlyView ? 'none' : 'auto'}>{rows}</Grid>;
  };

  if (custom) {
    return { renderCustomFaithMilestones };
  }
  return (
    <Grid
      pointerEvents={state.onlyView ? 'none' : 'auto'}
      style={{
        height: milestonesGridSize,
      }}>
      <Row size={7}>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_has_bible');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={hasBibleIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_has_bible')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_has_bible')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_has_bible.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_reading_bible');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={readingBibleIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_reading_bible')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_reading_bible')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_reading_bible.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_belief');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={statesBeliefIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_belief')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_belief')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_belief.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
      </Row>
      <Row size={1} />
      <Row size={7}>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_can_share');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={7}>
                <Image
                  source={canShareGospelIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_can_share')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={3}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_can_share')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_can_share.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_sharing');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={7}>
                <Image
                  source={sharingTheGospelIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_sharing')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={3}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_sharing')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_sharing.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_baptized');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={7}>
                <Image
                  source={baptizedIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_baptized')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={3}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_baptized')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_baptized.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
      </Row>
      <Row size={1} />
      <Row size={7}>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_baptizing');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={baptizingIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_baptizing')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_baptizing')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_baptizing.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_in_group');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={inChurchIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_in_group')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_in_group')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_in_group.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
        <Col size={5}>
          <TouchableOpacity
            onPress={() => {
              onMilestoneChange('milestone_planting');
            }}
            activeOpacity={1}
            style={styles.progressIcon}>
            <Col>
              <Row size={3}>
                <Image
                  source={startingChurchesIcon}
                  style={[
                    styles.progressIcon,
                    onCheckExistingMilestone('milestone_planting')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}
                />
              </Row>
              <Row size={1}>
                <Text
                  style={[
                    styles.progressIconText,
                    onCheckExistingMilestone('milestone_planting')
                      ? styles.progressIconActive
                      : styles.progressIconInactive,
                  ]}>
                  {contactSettings.fields.milestones.values.milestone_planting.label}
                </Text>
              </Row>
            </Col>
          </TouchableOpacity>
        </Col>
        <Col size={1} />
      </Row>
    </Grid>
  );
};
