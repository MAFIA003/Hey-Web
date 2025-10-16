// src/StateProvider.jsx
import { createContext, useContext, useReducer } from "react";

// This prepares the data layer
export const StateContext = createContext();

// This is the component that will wrap our entire app
// It provides the state to all components inside it
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// This is a custom hook that allows us to easily pull information from the data layer
export const useStateValue = () => useContext(StateContext);