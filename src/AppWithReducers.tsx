import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useReducer } from 'react';
import { v1 } from 'uuid';
import AddItemForm from './AddItemForm';
import { TaskPriorities, TaskStatuses, TaskType } from './api/todolists-api';
import './App.css';
import { addTaskAC, removeTaskAC, tasksReducer, updateTaskAC } from './state/tasks-reducer';
import { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, FilterValuesType, removeTodolistAC, todolistsReducer } from './state/todolists-reducer';
import TodoList from './TodoList'



export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithReducers() {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, dispatchToTodolistsReducer] = useReducer(todolistsReducer, [
        { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0 },
        { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0  }
    ])

    let [tasksObj, dispatchToTasksReducer] = useReducer(tasksReducer, {
        [todolistId1]: [
            { id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
        ],  
        [todolistId2]: [
            { id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
            { id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
        ]
    })


    const removeTask = (id: string, todolistId: string) => {
        dispatchToTasksReducer(removeTaskAC(id, todolistId))
    }

    const addTask = (newTaskTitle: string, todolistId: string) => {
        dispatchToTasksReducer(addTaskAC({
            todoListId: todolistId,
            title: newTaskTitle,
            status: TaskStatuses.New,
            addedDate: '',
            deadline: '',
            description: '',
            order: 0, 
            priority: 0, 
            startDate: '', 
            id: 'testId'
        }))
    }

    const changeStatus = (taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatchToTasksReducer(updateTaskAC(taskId, {status}, todolistId))
    }

    const changeTaskTitle = (taskId: string, newTitle: string, todolistId: string) => {
        dispatchToTasksReducer(updateTaskAC(taskId, {title:newTitle}, todolistId))
    }

    const changeTodolistTitle = (id: string, newTitle: string) => {
        dispatchToTodolistsReducer(changeTodolistTitleAC(id, newTitle))
    }

    const changeFilter = (value: FilterValuesType, todolistId: string) => {
        dispatchToTodolistsReducer(changeTodolistFilterAC(value, todolistId))
    }

    let removeTodolist = (todolistId: string) => {
        dispatchToTodolistsReducer(removeTodolistAC(todolistId))
        dispatchToTasksReducer(removeTodolistAC(todolistId))
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC({
            id: v1(),
            addedDate: '',
            order: 0,
            title: title
        })
        dispatchToTodolistsReducer(action)
        dispatchToTasksReducer(action)
    }

    return (
        <div className="App">
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <Menu />
                    </IconButton>
                    <Typography variant='h6'>
                        News
                    </Typography>
                    <Button color='inherit'>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={ { padding: '25px' } }>
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={5}>
                    {
                        todolists.map( ( tl ) => {
                            let tasksForTodoList = tasksObj[tl.id]

                            if (tl.filter === 'completed') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed)
                            }
                            if (tl.filter === 'active') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New)
                            }
                            return <Grid item>
                                <Paper elevation={2} style={ { padding: '10px' } }>
                                    <TodoList
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodoList}
                                        removeTask={removeTask}
                                        addTask={addTask}
                                        changeFilter={changeFilter}
                                        changeTaskStatus={changeStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle} />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}


export default AppWithReducers;
