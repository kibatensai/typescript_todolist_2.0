import { AddTodolistActionType, RemoveTodolistActionType } from './todolists-reducer';
import { v1 } from 'uuid';
import { TasksStateType } from './../App';
import { TaskPriorities, TaskStatuses, TaskType } from '../api/todolists-api';

const REMOVE_TASK = 'REMOVE-TASK'
const ADD_TASK = 'ADD-TASK'
const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS'
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE'

const initialState: TasksStateType = {}

export type RemoveTaskActionType = {
    type: typeof REMOVE_TASK,
    taskId: string
    todolistId: string
}
export type addTaskActionType = {
    type: typeof ADD_TASK,
    taskTitle: string
    todolistId: string
}

export type changeTaskStatusActionType = {
    type: typeof CHANGE_TASK_STATUS
    taskId: string
    status: TaskStatuses
    todolistId: string
}

export type changeTaskTitleActionType = {
    type: typeof CHANGE_TASK_TITLE
    taskId: string
    newTitle: string
    todolistId: string
}

type ActionsType = RemoveTaskActionType 
                 | addTaskActionType 
                 | changeTaskStatusActionType
                 | changeTaskTitleActionType
                 | AddTodolistActionType
                 | RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch(action.type) {
        case REMOVE_TASK:
            state[action.todolistId] = state[action.todolistId].filter(t => t.id !== action.taskId)
            return { ...state }
        case ADD_TASK:
            let newTask: TaskType = { 
                    id: v1(), 
                    title: action.taskTitle, 
                    status: TaskStatuses.New, 
                    todoListId: action.todolistId,
                    description: '',
                    startDate: '',
                    deadline: '', addedDate: '', order: 0, 
                    priority: TaskPriorities.Low
                }
            return { ...state,
                     [action.todolistId]: [newTask, ...state[action.todolistId]] }
        case CHANGE_TASK_STATUS:
            return { ...state,
                [action.todolistId]: state[action.todolistId]
                                        .map(t => t.id === action.taskId ? {...t, status: action.status} : t) }
        case CHANGE_TASK_TITLE:
            return { ...state,
                [action.todolistId]: state[action.todolistId]
                                        .map(t => t.id === action.taskId ? {...t, title: action.newTitle} : t) }
        case 'ADD-TODOLIST':
            state[action.todolistId] = []
            return { ...state }
        case 'REMOVE-TODOLIST':
            delete state[action.id]
            return { ...state }
        default:
            return state
    }
}


export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return { type: REMOVE_TASK, taskId, todolistId }
}

export const addTaskAC = (taskTitle: string, todolistId: string): addTaskActionType => {
    return { type: ADD_TASK, taskTitle, todolistId}
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): changeTaskStatusActionType => {
    return { type: CHANGE_TASK_STATUS, taskId, status, todolistId}
}

export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string): changeTaskTitleActionType => {
    return { type: CHANGE_TASK_TITLE, taskId, newTitle, todolistId}
}

