import React from 'react';
import { Provider } from 'react-redux';
import { AppRootState, RootReducerType } from '../../app/store';
import {v1} from 'uuid'
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { todolistsReducer } from '../../features/TodolistsList/todolists-reducer';
import { tasksReducer } from '../../features/TodolistsList/tasks-reducer';
import { TaskPriorities, TaskStatuses } from '../../api/todolists-api';
import { appReducer } from '../../app/app-reducer';
import thunk from 'redux-thunk';
import { authReducer } from '../../features/Login/auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import { HashRouter } from 'react-router-dom';

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootState = {
    todolists: [
        {id: 'todolistId1', title: 'Im first title', filter: 'all', entityStatus: 'idle', addedDate: '',
            order: 0 },
        {id: 'todolistId2', title: 'Im second title', filter: 'all', entityStatus: 'loading', addedDate: '',
            order: 0}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'Bread', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'Ham', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Chocolate Milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'Coke', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ],
    },
    app: {
        error: null,
        status: 'succeeded',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
}

export const BrowserRouterDecorator = (storyFn: any) => {
    return <HashRouter> {storyFn()} </HashRouter>
}