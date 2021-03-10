import { AddTodolistActionType, RemoveTodolistActionType, SetTodoListsActionType, SET_TODOLISTS } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api';
import { Dispatch } from 'redux';
import { AppRootState } from '../../app/store';
import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';

const REMOVE_TASK = 'REMOVE-TASK'
const ADD_TASK = 'ADD-TASK'
const UPDATE_TASK = 'UPDATE-TASK'
const SET_TASKS = 'SET-TASKS'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch(action.type) {
        case REMOVE_TASK:
            return { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        case ADD_TASK:
            return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
        case UPDATE_TASK:
            return { ...state,
                [action.todolistId]: state[action.todolistId]
                                        .map(t => t.id === action.taskId ? {...t, ...action.model} : t) }
        case 'ADD-TODOLIST':
            return { ...state, [action.todolist.id]: [] }
        case 'REMOVE-TODOLIST':
            delete state[action.id]
            return { ...state }
        case SET_TODOLISTS:
            const copyState = {...state}
            action.todolists.forEach(tl => {copyState[tl.id] = []})
            return copyState  
        case SET_TASKS:
            return { ...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

// ------ ACTIONS ------
export const removeTaskAC = (taskId: string, todolistId: string) => ({ type: REMOVE_TASK, taskId, todolistId } as const)
export const addTaskAC = (task: TaskType) => ({ type: ADD_TASK, task } as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({ type: UPDATE_TASK, taskId, model, todolistId}  as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: SET_TASKS, tasks, todolistId}  as const)

// ------ THUNK ------
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then( ({ data }) => {
            dispatch(setTasksAC(data.items, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const removeTaskTC = (taskId: string ,todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => dispatch(removeTaskAC(taskId, todolistId)))
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then( ({ data }) =>  {
            if(data.resultCode === 0) {
                dispatch(addTaskAC(data.data.item))
                dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(data, dispatch)
            }
        })
        .catch( err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => 
    (dispatch: ThunkDispatch, getState: () => AppRootState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if(!task) {
            console.warn('Task is not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then( ({ data }) =>  {
                if(data.resultCode === 0) {
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            } else {
                handleServerAppError(data, dispatch)
            }
            })
            .catch( err => {
                handleServerNetworkError(err, dispatch)
            })

}
// ------ TYPES ------ 
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type ActionsType = 
                 | ReturnType<typeof removeTaskAC> 
                 | ReturnType<typeof addTaskAC> 
                 | ReturnType<typeof updateTaskAC>
                 | AddTodolistActionType
                 | RemoveTodolistActionType
                 | SetTodoListsActionType
                 | ReturnType<typeof setTasksAC>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>