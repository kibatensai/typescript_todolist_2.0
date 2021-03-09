import thunk  from 'redux-thunk';
import { tasksReducer } from '../features/TodolistsList/tasks-reducer';
import { applyMiddleware, combineReducers } from 'redux';
import { createStore } from 'redux';
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunk))


// @ts-ignore
window.store = store

