// src/reducer.js

// This is the initial state of our data layer (before anyone logs in)
export const initialState = {
  user: null,
};

// These are the actions we can dispatch to change the state
export const actionTypes = {
  SET_USER: "SET_USER",
};

// The reducer listens for dispatched actions and updates the state
const reducer = (state, action) => {
  console.log(action); // Log the action to see what's happening
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state, // Keep the existing state
        user: action.user, // But, change the user to the one we dispatched
      };
    default:
      return state;
  }
};

export default reducer;