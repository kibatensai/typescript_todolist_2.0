import { tasksReducer, TasksStateType } from './tasks-reducer';
import { addTodolistAC, TodolistDomainType, todolistsReducer } from './todolists-reducer';
import { TodolistType } from '../../api/todolists-api';

test('ids should be equal', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    let todolist: TodolistType = {
        id: 'testId',
        addedDate: '',
        order: 0,
        title: 'new todolist'
    }

    const action = addTodolistAC({todolist})
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)


})