import React from 'react';
import { Provider } from 'react-redux';
import { AppRootState } from '../../app/store';
import {v1} from 'uuid'
import { combineReducers, createStore } from 'redux';
import { todolistsReducer } from '../../features/TodolistsList/todolists-reducer';
import { tasksReducer } from '../../features/TodolistsList/tasks-reducer';
import { TaskPriorities, TaskStatuses } from '../../api/todolists-api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootState = {
    todolists: [
        {id: 'todolistId1', title: 'Im first title', filter: 'all', addedDate: '',
            order: 0 },
        {id: 'todolistId2', title: 'Im second title', filter: 'all', addedDate: '', 
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
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState)

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
}