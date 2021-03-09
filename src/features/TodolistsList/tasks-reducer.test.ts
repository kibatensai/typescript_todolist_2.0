
import { addTaskAC, removeTaskAC, setTasksAC, tasksReducer, TasksStateType, updateTaskAC } from './tasks-reducer';
import { addTodolistAC, removeTodolistAC, setTodolistsAC } from './todolists-reducer';
import { TaskPriorities, TaskStatuses } from '../../api/todolists-api';

let startState: TasksStateType = {}

beforeEach(() => {
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ],
        'todolistId2': [
            {id: '1', title: 'lose weight', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '2', title: 'eat less', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '3', title: 'be shredded', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        todoListId: 'todolistId2',
        title: 'maintain physique',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0, 
        priority: 0, 
        startDate: '', 
        id: 'testId'
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('maintain physique')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC('2', {status: TaskStatuses.New}, 'todolistId2')

    const endState = tasksReducer(startState, action)

 
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    
}) 

test('title of specified task should be changed', () => {

    const action = updateTaskAC('2', {title: 'changed'}, 'todolistId2')
    
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('changed')
    expect(endState['todolistId1'][1].title).toBe('JS')
    
}) 

test('new property with new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: 'testId',
        addedDate: '',
        order: 0,
        title: 'some title'
    })
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if(!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC('todolistId2')
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).toBeUndefined()
})


test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC([
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ])

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toStrictEqual([])
})


test('tasks for todolist should be added', () => {
    const action = setTasksAC(startState['todolistId1'], 'todolistId1')

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)


})