import { AddTodolistActionType, RemoveTodolistActionType, SetTodoListsActionType, SET_TODOLISTS } from './todolists-reducer';
import { v1 } from 'uuid';
import { TasksStateType } from './../App';
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../api/todolists-api';
import { Dispatch } from 'redux';
import { AppRootState } from './store';

const REMOVE_TASK = 'REMOVE-TASK'
const ADD_TASK = 'ADD-TASK'
const UPDATE_TASK = 'UPDATE-TASK'
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE'
const SET_TASKS = 'SET-TASKS'

const initialState: TasksStateType = {}

export type RemoveTaskActionType = {
    type: typeof REMOVE_TASK,
    taskId: string
    todolistId: string
}
export type addTaskActionType = {
    type: typeof ADD_TASK,
    task: TaskType
}

export type updateTaskActionType = {
    type: typeof UPDATE_TASK
    taskId: string
    model: UpdateDomainTaskModelType
    todolistId: string
}

export type changeTaskTitleActionType = {
    type: typeof CHANGE_TASK_TITLE
    taskId: string
    newTitle: string
    todolistId: string
}

export type SetTasksActionType = {
    type: typeof SET_TASKS
    tasks: TaskType[]
    todolistId: string
}

type ActionsType = RemoveTaskActionType 
                 | addTaskActionType 
                 | updateTaskActionType
                 | changeTaskTitleActionType
                 | AddTodolistActionType
                 | RemoveTodolistActionType
                 | SetTodoListsActionType
                 | SetTasksActionType

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch(action.type) {
        case REMOVE_TASK:
            state[action.todolistId] = state[action.todolistId].filter(t => t.id !== action.taskId)
            return { ...state }
        case ADD_TASK:
            let newTask: TaskType = action.task
            return { ...state,
                     [newTask.todoListId]: [newTask, ...state[newTask.todoListId]] }
        case UPDATE_TASK:
            return { ...state,
                [action.todolistId]: state[action.todolistId]
                                        .map(t => t.id === action.taskId ? {...t, ...action.model} : t) }
        case CHANGE_TASK_TITLE:
            return { ...state,
                [action.todolistId]: state[action.todolistId]
                                        .map(t => t.id === action.taskId ? {...t, title: action.newTitle} : t) }
        case 'ADD-TODOLIST':
            return { ...state,
                    [action.todolist.id]: [] }
        case 'REMOVE-TODOLIST':
            delete state[action.id]
            return { ...state }
        case SET_TODOLISTS:
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState  
        case SET_TASKS:
            return { ...state,
                    [action.todolistId]: action.tasks}
        default:
            return state
    }
}


export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return { type: REMOVE_TASK, taskId, todolistId }
}

export const addTaskAC = (task: TaskType): addTaskActionType => {
    return { type: ADD_TASK, task }
}

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): updateTaskActionType => {
    return { type: UPDATE_TASK, taskId, model, todolistId}
}

export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string): changeTaskTitleActionType => {
    return { type: CHANGE_TASK_TITLE, taskId, newTitle, todolistId}
}

export const setTasksAC = (tasks: TaskType[], todolistId: string): SetTasksActionType => ({type: SET_TASKS, tasks, todolistId})


// ------ THUNK ------

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then( ({ data }) => dispatch(setTasksAC(data.items, todolistId)) )
}

export const removeTaskTC = (taskId: string ,todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => dispatch(removeTaskAC(taskId, todolistId)))
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title)
        .then( ({ data }) =>  dispatch(addTaskAC(data.data.item)))
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootState) => {
    
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
        .then( ({ data }) =>  dispatch(updateTaskAC(taskId, domainModel, todolistId)))
}