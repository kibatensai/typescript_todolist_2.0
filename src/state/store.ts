import thunk  from 'redux-thunk';
import { tasksReducer } from './tasks-reducer';
import { applyMiddleware, combineReducers } from 'redux';
import { createStore } from 'redux';
import { todolistsReducer } from './todolists-reducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunk))


// @ts-ignore
window.store = store

