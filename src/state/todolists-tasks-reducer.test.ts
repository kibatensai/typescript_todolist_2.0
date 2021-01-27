import { tasksReducer } from './tasks-reducer';
import { addTodolistAC, todolistsReducer } from './todolists-reducer';
import { TasksStateType, TodolistType } from './../App';

test('ids should be equal', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistType> = []

    const action = addTodolistAC('new todolist')
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromKeys = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromKeys).toBe(action.todolistId)
    expect(idFromTodolists).toBe(action.todolistId)


})