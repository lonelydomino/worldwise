/* eslint-disable react/prop-types */

import { createContext, useEffect, useContext, useReducer, useCallback } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {...state, isLoading: false, cities: [...state.cities, action.payload]}
    case "city/deleted":
      return {...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload)}
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("unknown action type");
  }
};
const CitiesProvider = ({ children }) => {

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "there was an error loading cities...",
        });
      }
    };
    fetchCities();
  }, []);

  const createCity = async (newCity) => {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-type": "application/json" },
      });
      const data = await res.json();
      dispatch({type: 'city/created', payload: data})
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error creating the city...",
      });
    }
  };
  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({type: 'city/deleted', payload: id})
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error deleting the city...",
      });
    }
  };

  const getCity = useCallback( async (id) => {
    if (Number(id) === currentCity.id) return

    
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error loading the city...",
      });
    }
  }, [currentCity.id])

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
};

export { CitiesProvider, useCities };
