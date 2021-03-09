import { Dispatch } from 'redux';
import { todolistsAPI, TodolistType } from '../../api/todolists-api';

const initialState: Array<TodolistDomainType> = []

export const SET_TODOLISTS = 'SET-TODOLISTS'

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch(action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [ {...action.todolist, filter: 'all'}, ...state ]
        case 'CHANGE-TODOLIST-TITLE': 
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER': 
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case SET_TODOLISTS:
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
}

// ------ ACTIONS ------
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST', id } as const) 
export const addTodolistAC = (todolist: TodolistType) => ({ type: 'ADD-TODOLIST', todolist} as const) 
export const changeTodolistTitleAC = (id: string, title: string) => ({ type: 'CHANGE-TODOLIST-TITLE', id, title} as const) 
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) => ({ type: 'CHANGE-TODOLIST-FILTER', id, filter} as const) 
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: SET_TODOLISTS, todolists} as const) 

// ------ THUNK ------
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists()
        .then( ({ data }) => dispatch(setTodolistsAC(data)) ) 
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTodolist(todolistId)
        .then( ({ data }) => dispatch(removeTodolistAC(todolistId)))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTodolist(title)
        .then( ({ data }) => dispatch(addTodolistAC(data.data.item)))
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolistTitle(id, title)
        .then( ({ data }) => dispatch(changeTodolistTitleAC(id, title)))
}

// ------ TYPES ------
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodoListsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType = RemoveTodolistActionType
                | AddTodolistActionType
                | ReturnType<typeof changeTodolistTitleAC>
                | ReturnType<typeof changeTodolistFilterAC>
                | SetTodoListsActionType
                
export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & {
    filter : FilterValuesType
}