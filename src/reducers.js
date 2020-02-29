import { combineReducers } from "redux";
import { LOGIN } from "./actions";

const login = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return Object.assign(
        {},
        {
          user: action.user.user_name
        }
      );

    default:
      return state;
  }
};

const AccountReducer = combineReducers({
  login
});

export default AccountReducer;
