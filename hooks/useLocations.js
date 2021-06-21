import React from 'react';

const useLocations = () => {
  // TODO: get from AsyncStorage
  /*
  const locations = [
    {
        "name": "Northern Cyprus",
        "ID": "100380091"
    },
  ];
  */
  const locations = [
    {
      name: 'Northern Cyprus',
      value: '100380091',
    },
    {
      name: 'Spain > Aragón',
      value: '100074578',
    },
    {
      name: 'Spain > Andalucía',
      value: '100074577',
    },
    {
      name: 'Spain > Extremadura',
      value: '100074587',
    },
    {
      name: 'Baja California',
      value: '100245359',
    },
  ];
  return locations;
};
export default useLocations;
