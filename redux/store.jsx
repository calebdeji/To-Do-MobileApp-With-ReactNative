import { createStore } from "redux";
import { userIDReducer } from "./Reducer";

export const Store = createStore(userIDReducer);
