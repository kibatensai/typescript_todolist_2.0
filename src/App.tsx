import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useState } from 'react';
import { v1 } from 'uuid';
import AddItemForm from './AddItemForm';
import './App.css';
import TodoList, { TaskObjType } from './TodoList'

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskObjType>
}

function App() {
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
            isDone: false
        }
        let taskArray = tasksObj[todolistId]
        let newTasks = [newTask, ...taskArray]
        tasksObj[todolistId] = newTasks
        setTasks({...tasksObj})
    }

    const changeStatus = (taskId: string, isDone: boolean, todolistId: string) => {
        let taskArray = tasksObj[todolistId]
        let task = taskArray.find(t => t.id === taskId)
        if (task) { 
            task.isDone = isDone 
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

    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' }
    ])

    let removeTodolist = (todolistId: string) => {
        let filteredTodolists = todolists.filter(tl => tl.id !== todolistId)
        setTodolists(filteredTodolists)
        delete tasksObj[todolistId]
        setTasks(tasksObj)
    }

    let [tasksObj, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            { id: v1(), title: "HTML&CSS", isDone: true },
            { id: v1(), title: "JS", isDone: true },
            { id: v1(), title: "ReactJS", isDone: false },
            { id: v1(), title: "Python", isDone: false }],
        [todolistId2]: [
            { id: v1(), title: "Book", isDone: false },
            { id: v1(), title: "Milk", isDone: true }
        ]
    })

    const addTodolist = (title: string) => {
        let todolist: TodolistType = {
            id: v1(),
            title: title,
            filter: 'all'
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
                                tasksForTodoList = tasksForTodoList.filter(t => t.isDone === true)
                            }
                            if (tl.filter === 'active') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.isDone === false)
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
