import { addTodolistAC, AddTodolistActionType, removeTodolistAC, RemoveTodolistActionType, setTodolistsAC, SetTodoListsActionType, SET_TODOLISTS } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api';
import { Dispatch } from 'redux';
import { AppRootState } from '../../app/store';
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const REMOVE_TASK = 'REMOVE-TASK'
const ADD_TASK = 'ADD-TASK'
const UPDATE_TASK = 'UPDATE-TASK'
const SET_TASKS = 'SET-TASKS'

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{taskId: string, todolistId: string}>){
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
            // { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        },
        addTaskAC(state, action: PayloadAction<{task: TaskType}>){
            state[action.payload.task.todoListId].unshift(action.payload.task)
            // { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todolistId: string}>){
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
            // { ...state,
            //      [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t) }
        },
        setTasksAC(state, action: PayloadAction<{tasks: TaskType[], todolistId: string}>){
            state[action.payload.todolistId] = action.payload.tasks
            // { ...state, [action.todolistId]: action.tasks}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
            // { ...state, [action.todolist.id]: [] }
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
            // delete state[action.id]
            // return { ...state }
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {state[tl.id] = []})
            // const copyState = {...state}
            // action.todolists.forEach(tl => {copyState[tl.id] = []})
            // return copyState
        })
    }
    // {
    //     [addTodolistAC.type]: (state, action: PayloadAction<{}>) => {

    //     },
    //     [removeTodolistAC.type]: (state, action: PayloadAction<{}>) => {

    //     },
    //     [setTodolistsAC.type]: (state, action: PayloadAction<{}>) => {

    //     },
    // }
})

export const tasksReducer = slice.reducer
export const { removeTaskAC, addTaskAC, updateTaskAC, setTasksAC } = slice.actions

// ------ THUNK ------
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then( ({ data }) => {
            dispatch(setTasksAC({tasks: data.items, todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const removeTaskTC = (taskId: string ,todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => dispatch(removeTaskAC({taskId, todolistId})))
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then( ({ data }) =>  {
            if(data.resultCode === 0) {
                dispatch(addTaskAC({task: data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(data, dispatch)
            }
        })
        .catch( err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTaskTC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootState) => {
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
            ...model
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then( ({ data }) =>  {
                if(data.resultCode === 0) {
                dispatch(updateTaskAC({taskId, model, todolistId}))
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

export type TasksStateType = {
    [key: string]: Array<TaskType>
}