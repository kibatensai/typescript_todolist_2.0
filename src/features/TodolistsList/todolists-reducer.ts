import { handleServerNetworkError } from './../../utils/error-utils';
import { Dispatch } from 'redux';
import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer';

const initialState: Array<TodolistDomainType> = []

export const SET_TODOLISTS = 'SET-TODOLISTS'

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch(action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [ {...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state ]
        case 'CHANGE-TODOLIST-TITLE': 
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER': 
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case SET_TODOLISTS:
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
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
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status} as const) 

// ------ THUNK ------
export const fetchTodolistsTC = () => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then( ({ data }) => {
            dispatch(setTodolistsAC(data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        }) 
}
export const removeTodolistTC = (todolistId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then( ({ data }) => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTodolistTC = (title: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then( ({ data }) => {
            dispatch(addTodolistAC(data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
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
                | ReturnType<typeof changeTodolistEntityStatusAC>       
export type FilterValuesType = 'all' | 'completed' | 'active'
export type TodolistDomainType = TodolistType & { 
    filter : FilterValuesType 
    entityStatus: RequestStatusType }
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>