import thunk from "redux-thunk";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { applyMiddleware, combineReducers } from "redux";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export type AppRootState = ReturnType<typeof rootReducer>;


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

// @ts-ignore
window.store = store;
