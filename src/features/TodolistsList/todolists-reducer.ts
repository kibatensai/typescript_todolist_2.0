import { handleServerNetworkError } from './../../utils/error-utils';
import { Dispatch } from 'redux';
import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []

export const SET_TODOLISTS = 'SET-TODOLISTS'

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{id: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
            // state.filter(tl => tl.id !== action.id)
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType}>){
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            // [ {...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state ]
        },
        changeTodolistTitleAC(state, action: PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
            // state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        },
        changeTodolistFilterAC(state, action: PayloadAction<{filter: FilterValuesType, id: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
            // state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: TodolistType[]}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
            // state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        },
    }
})

export const todolistsReducer = slice.reducer
export const { removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, setTodolistsAC, changeTodolistEntityStatusAC } = slice.actions

// ------ THUNK ------
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
        .then( ({ data }) => {
            dispatch(setTodolistsAC({todolists: data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then( ({ data }) => {
            dispatch(removeTodolistAC({id: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(title)
        .then( ({ data }) => {
            dispatch(addTodolistAC({todolist: data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolistTitle(id, title)
        .then( ({ data }) => dispatch(changeTodolistTitleAC({id, title})))
}

// ------ TYPES ------
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodoListsActionType = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter : FilterValuesType
    entityStatus: RequestStatusType }
