const renderHealthMilestones = () => {
  return (
    <Grid
      pointerEvents={state.onlyView ? 'none' : 'auto'}
      style={{ position: 'relative', left: -20 }}>
      <Row style={{ height: spacing }} />
      <Row style={{ height: sideSize }}>
        <Col style={{ width: spacing }} />
        <Col style={{ width: sideSize }}>
          <Image
            source={circleIcon}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              align: 'center',
              position: 'absolute',
              height: '95%',
              width: '95%',
              marginTop: '2%',
              marginRight: '2%',
              marginBottom: '2%',
              marginLeft: '2%',
              opacity: onCheckExistingHealthMetric('church_commitment') ? 1 : 0.15,
            }}
          />
          <Image
            source={dottedCircleIcon}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              align: 'center',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: onCheckExistingHealthMetric('church_commitment') ? 0.15 : 1,
            }}
          />
          <Row style={{ height: sideSize * 0.1 }} />
          <Row style={{ height: sideSize * 0.8 }}>
            <Row style={{ height: sideSize * 0.8 }}>
              <Col style={{ width: sideSize * 0.1 }} />
              <Col style={{ width: sideSize * 0.8 }}>
                <Row size={5}>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={1} />
                    <Row size={4}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_giving');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={givingIcon}
                                style={
                                  onCheckExistingHealthMetric('church_giving')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_giving')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_giving.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={6}>
                      <Col size={100}>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_fellowship');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={fellowShipIcon}
                                style={
                                  onCheckExistingHealthMetric('church_fellowship')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_fellowship')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_fellowship.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={1} />
                  </Col>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={1} />
                    <Row size={4}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_communion');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={communionIcon}
                                style={
                                  onCheckExistingHealthMetric('church_communion')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_communion')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_communion.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col size={2} />
                </Row>

                <Row size={7}>
                  <Col size={3}>
                    <Row size={2} />
                    <Row size={6}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_baptism');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={baptismIcon}
                                style={
                                  onCheckExistingHealthMetric('church_baptism')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_baptism')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_baptism.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={2} />
                  </Col>
                  <Col size={4} />
                  <Col size={3}>
                    <Row size={2} />
                    <Row size={6}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_prayer');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={prayerIcon}
                                style={
                                  onCheckExistingHealthMetric('church_prayer')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_prayer')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_prayer.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={2} />
                  </Col>
                  <Col size={4} />
                  <Col size={3}>
                    <Row size={2} />
                    <Row size={6}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_leaders');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={leadersIcon}
                                style={
                                  onCheckExistingHealthMetric('church_leaders')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_leaders')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_leaders.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={2} />
                  </Col>
                </Row>

                <Row size={5}>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={4}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_bible');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={bibleStudyIcon}
                                style={
                                  onCheckExistingHealthMetric('church_bible')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_bible')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_bible.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={1} />
                  </Col>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={1} />
                    <Row size={4}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_praise');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={praiseIcon}
                                style={
                                  onCheckExistingHealthMetric('church_praise')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_praise')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_praise.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col size={2} />
                  <Col size={3}>
                    <Row size={4}>
                      <Col>
                        <Row size={60}>
                          <Col>
                            <TouchableOpacity
                              onPress={() => {
                                onHealthMetricChange('church_sharing');
                              }}
                              activeOpacity={1}>
                              <Image
                                source={sharingTheGospelIcon}
                                style={
                                  onCheckExistingHealthMetric('church_sharing')
                                    ? styles.activeImage
                                    : styles.inactiveImage
                                }
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row
                          size={40}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.toggleText,
                              onCheckExistingHealthMetric('church_sharing')
                                ? styles.activeToggleText
                                : styles.inactiveToggleText,
                            ]}>
                            {groupSettings.fields.health_metrics.values.church_sharing.label}
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                    <Row size={1} />
                  </Col>
                  <Col size={2} />
                </Row>
              </Col>
              <Col style={{ width: sideSize * 0.1 }} />
            </Row>
          </Row>
          <Row style={{ height: sideSize * 0.1 }} />
        </Col>
        <Col style={{ width: spacing }} />
      </Row>
      <Row style={{ height: spacing }} />
    </Grid>
  );
};

const renderCustomHealthMilestones = () => {
  const healthMetricsList = Object.keys(groupSettings.fields.health_metrics.values);
  const customHealthMetrics = healthMetricsList.filter(
    (milestoneItem) => defaultHealthMilestones.indexOf(milestoneItem) < 0,
  );
  const rows = [];
  let columnsByRow = [];
  customHealthMetrics.forEach((value, index) => {
    if ((index + 1) % 3 === 0 || index === customHealthMetrics.length - 1) {
      // every third milestone or last milestone
      columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
      columnsByRow.push(
        <Col key={columnsByRow.length} size={5}>
          <TouchableOpacity
            onPress={() => {
              onHealthMetricChange(value);
            }}
            activeOpacity={1}
            underlayColor={onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray}
            style={{
              borderRadius: 10,
              backgroundColor: onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray,
              padding: 10,
            }}>
            <Text
              style={[
                styles.progressIconText,
                {
                  color: onCheckExistingHealthMetric(value) ? '#FFFFFF' : '#000000',
                },
              ]}>
              {groupSettings.fields.health_metrics.values[value].label}
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
              onHealthMetricChange(value);
            }}
            activeOpacity={1}
            underlayColor={onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray}
            style={{
              borderRadius: 10,
              backgroundColor: onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray,
              padding: 10,
            }}>
            <Text
              style={[
                styles.progressIconText,
                {
                  color: onCheckExistingHealthMetric(value) ? '#FFFFFF' : '#000000',
                },
              ]}>
              {groupSettings.fields.health_metrics.values[value].label}
            </Text>
          </TouchableHighlight>
        </Col>,
      );
    }
  });

  return (
    <Grid pointerEvents={state.onlyView ? 'none' : 'auto'} style={{ marginBottom: 50 }}>
      {rows}
    </Grid>
  );
};
