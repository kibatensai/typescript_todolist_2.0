import React from 'react';
import { Provider } from 'react-redux';
import { AppRootState } from '../state/store';
import {v1} from 'uuid'
import { combineReducers, createStore } from 'redux';
import { todolistsReducer } from '../state/todolists-reducer';
import { tasksReducer } from '../state/tasks-reducer';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'Im first title', filter: 'all'},
        {id: 'todolistId2', title: 'Im second title', filter: 'all'}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'Bread', isDone: true},
            {id: v1(), title: 'Ham', isDone: true}
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Chocolate Milk', isDone: true},
            {id: v1(), title: 'Coke', isDone: true}
        ],
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState)

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}> {storyFn()} </Provider>
}