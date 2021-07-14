import { useSelector } from 'react-redux';

const useTheme = () => {
  //const theme = useSelector(state => state.appReducer.theme);
  const theme = null;

  const getSelectorColor = (status) => {
    let newColor;
    if (status === 'new' || status === 'unassigned' || status === 'inactive') {
      newColor = '#d9534f';
    } else if (status === 'unassignable' || status === 'assigned' || status === 'paused') {
      newColor = '#f0ad4e';
    } else if (status === 'active') {
      newColor = '#5cb85c';
    } else if (status === 'from_facebook') {
      newColor = '#366184';
    } else if (status === 'closed') {
      newColor = '#000';
    }
    return newColor;
  };

  return {
    theme,
    getSelectorColor,
  };
};
export default useTheme;
