import { USER } from "../actions/const";

const initialUser = {
  uid: "",
  name: "",
  dayOfbirth: "",
  gender: "",
  isOnline: false,
  isChat: false,
  authenticating: false,
  authenticated: false,
  error: null,
};

const UserReducer = (state = initialUser, action) => {
  switch (action.type) {
    case `${USER.USER_LOGIN}_REQUEST`:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case `${USER.USER_LOGIN}_SUCCESS`:
      state = {
        ...state,
        ...action.payload.user,
        authenticated: true,
        authenticating: false,
      };
      break;

    case `${USER.USER_LOGIN}_FAILURE`:
      state = {
        ...state,
        authenticated: false,
        authenticating: false,
        error: action.payload.error,
      };
      break;
    case `${USER.USER_UPDATE}_SUCCESS`:
      state = {
        ...state,
        ...action.payload.user,
        authenticated: true,
        authenticating: false,
      };
      break;
    case `${USER.USER_UPDATE}_FAILURE`:
      state = {
        ...state,
        error: action.payload.error,
      };
      break;
    case `${USER.USER_LOGOUT}_REQUEST`:
      break;
    case `${USER.USER_LOGOUT}_SUCCESS`:
      state = {
        ...initialUser,
      };
      break;
    case `${USER.USER_LOGOUT}_FAILURE`:
      state = {
        ...state,
        error: action.payload.error,
      };
      break;
  }
  return state;
};

export default UserReducer;
