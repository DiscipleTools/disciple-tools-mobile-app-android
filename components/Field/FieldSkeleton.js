import React from 'react';

// 3rd-party Components
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

// TODO: mock FAB with absolute positioning?
const FieldSkeleton = ({ isRTL, windowWidth }) => (
  <ContentLoader
    rtl={isRTL}
    speed={3}
    width={windowWidth}
    height={75}
    viewBox={'0 ' + '0 ' + windowWidth + ' 80'}
    backgroundColor="#e7e7e7"
    foregroundColor="#b7b7b7">
    <Circle cx="15" cy="25" r="15" />
    <Rect x="50" y="15" rx="2" ry="2" width="200" height="20" />
    <Rect x="275" y="15" rx="2" ry="2" width="75" height="7" />
    <Rect x="275" y="30" rx="2" ry="2" width="75" height="7" />
    <Circle cx="375" cy="25" r="15" />
  </ContentLoader>
);
export default FieldSkeleton;
