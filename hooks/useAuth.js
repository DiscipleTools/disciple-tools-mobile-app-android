import { useSelector, useDispatch } from 'react-redux';
import {
  toggleAutoLogin as _toggleAutoLogin,
  toggleRememberLoginDetails as _toggleRememberLoginDetails,
} from 'store/actions/auth.actions';

const useAuth = () => {
  const dispatch = useDispatch();

  const hasPIN = useSelector((state) => state.authReducer.hasPIN);
  const isAutoLogin = useSelector((state) => state.authReducer.isAutoLogin);
  const rememberLoginDetails = useSelector((state) => state.authReducer.rememberLoginDetails);
  const cnoncePIN = useSelector((state) => state.authReducer.cnoncePIN);
  const cnonceLogin = useSelector((state) => state.authReducer.cnonceLogin);

  const toggleAutoLogin = () => dispatch(_toggleAutoLogin());
  const toggleRememberLoginDetails = () => dispatch(_toggleRememberLoginDetails());

  return {
    hasPIN,
    isAutoLogin,
    rememberLoginDetails,
    cnoncePIN,
    cnonceLogin,
    toggleAutoLogin,
    toggleRememberLoginDetails,
  };
};
export default useAuth;
