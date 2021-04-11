import { v1 } from 'uuid';
import { RequestStatusType } from '../../app/app-reducer';
import { TodolistType } from './../../api/todolists-api';
import { todolistsReducer, removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, TodolistDomainType, FilterValuesType, setTodolistsAC, changeTodolistEntityStatusAC } from './todolists-reducer';

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []
let newTodolistTitle: string

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0}
    ]
    newTodolistTitle = 'NewTodolist'
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC({id: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {

    let todolist: TodolistType = {
        id: 'testId',
        addedDate: '',
        order: 0,
        title: 'some title'
    }

    const endState = todolistsReducer(startState, addTodolistAC({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('all')
    expect(endState[0].id).toBeDefined()
})

test('correct todolist should change its name', () => {

    const endState = todolistsReducer(startState, changeTodolistTitleAC({id: todolistId2, title: newTodolistTitle}))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const endState = todolistsReducer(startState, changeTodolistFilterAC({filter: newFilter, id: todolistId2}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {

    const action = setTodolistsAC({todolists: startState})

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {

    let newStatus: RequestStatusType = 'loading'

    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({id: todolistId2, status: newStatus}))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})