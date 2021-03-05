import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useState } from 'react';
import { v1 } from 'uuid';
import AddItemForm from './AddItemForm';
import { TaskStatuses, TaskPriorities, TaskType } from './api/todolists-api';
import './App.css';
import { FilterValuesType, TodolistDomainType } from './state/todolists-reducer';
import TodoList from './TodoList'




export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '',
        order: 0 },
        { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '',
        order: 0 }
    ])


    let [tasksObj, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'React Book', status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}
        ]
    })


    const removeTask = (id: string, todolistId: string) => {
        let taskArray = tasksObj[todolistId]
        let filteredTasks = taskArray.filter(t => t.id !== id)
        tasksObj[todolistId] = filteredTasks
        setTasks({...tasksObj})
    }

    const addTask = (newTaskTitle: string, todolistId: string) => {
        let newTask = {
            id: v1(),
            title: newTaskTitle,
            status: TaskStatuses.New, todoListId: todolistId, description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        }
        let taskArray = tasksObj[todolistId]
        let newTasks = [newTask, ...taskArray]
        tasksObj[todolistId] = newTasks
        setTasks({...tasksObj})
    }

    const changeStatus = (taskId: string, status: TaskStatuses, todolistId: string) => {
        let taskArray = tasksObj[todolistId]
        let task = taskArray.find(t => t.id === taskId)
        if (task) { 
            task.status = status 
            setTasks({...tasksObj}) }
    }

    const changeTaskTitle = (taskId: string, newTitle: string, todolistId: string) => {
        let taskArray = tasksObj[todolistId]
        let task = taskArray.find(t => t.id === taskId)
        if (task) { 
            task.title = newTitle 
            setTasks({...tasksObj}) }
    }

    const changeTodolistTitle = (id: string, newTitle: string) => {
        const todolist = todolists.find(tl => tl.id === id)
        if(todolist) {
            todolist.title = newTitle
            setTodolists([...todolists])
        }
    }

    const changeFilter = (value: FilterValuesType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
        }
        setTodolists([...todolists])
    }



    let removeTodolist = (todolistId: string) => {
        let filteredTodolists = todolists.filter(tl => tl.id !== todolistId)
        setTodolists(filteredTodolists)
        delete tasksObj[todolistId]
        setTasks(tasksObj)
    }



    const addTodolist = (title: string) => {
        let todolist: TodolistDomainType = {
            id: v1(),
            title: title,
            filter: 'all', addedDate: '', order: 0
        }
        setTodolists([todolist, ...todolists])
        setTasks({...tasksObj,
                [todolist.id]: []})
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
                                tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New)
                            }
                            if (tl.filter === 'active') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed)
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


export default App;
