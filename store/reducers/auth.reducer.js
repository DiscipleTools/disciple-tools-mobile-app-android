//import * as actions from "store/actions/auth.actions";

const initialState = {
  cnoncePIN: null,
  cnonceLogin: null,
  isAutoLogin: null,
  rememberLoginDetails: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
