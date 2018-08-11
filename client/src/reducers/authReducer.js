import { FETCH_USER } from '../actions/types';

export default function (state = null, action) { // we return null, so be default we don't know if he is logged-in
  switch (action.type) {
    case FETCH_USER:
      return (action.payload.length !== 0) ? action.payload : false; // if the string is empty string > not logged in > return false
    default:
      return state;
  }
}
