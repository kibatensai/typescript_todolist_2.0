import { Dispatch } from 'redux';
import { v1 } from 'uuid';
import { todolistsAPI, TodolistType } from '../api/todolists-api';

export let todolistId1 = v1()
export let todolistId2 = v1()

const initialState: Array<TodolistDomainType> = []

export const SET_TODOLISTS = 'SET-TODOLISTS'


export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string,
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string,
    filter: FilterValuesType
}

export type SetTodoListsActionType = {
    type: typeof SET_TODOLISTS,
    todolists: TodolistType[]
}

type ActionsType = RemoveTodolistActionType 
                | AddTodolistActionType 
                | ChangeTodolistTitleActionType 
                | ChangeTodolistFilterActionType
                | SetTodoListsActionType

export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter : FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch(action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodolist: TodolistDomainType = { ...action.todolist, filter: 'all'}
            return [ newTodolist, ...state ]
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id)
            if(todolist) {
                    todolist.filter = action.filter
            }
            return [...state]
        }
        case SET_TODOLISTS:
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
}


export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId }
}

export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', todolist}
}

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', id, title}
}

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', id, filter}
}

export const setTodolistsAC = (todolists: TodolistType[]): SetTodoListsActionType => ({type: SET_TODOLISTS, todolists})


// ------ THUNK ------

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists()
        .then( ({ data }) => dispatch(setTodolistsAC(data)) )
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId)
        .then( ({ data }) => dispatch(removeTodolistAC(todolistId)))
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title)
        .then( ({ data }) => dispatch(addTodolistAC(data.data.item)))
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolistTitle(id, title)
        .then( ({ data }) => dispatch(changeTodolistTitleAC(id, title)))
}

