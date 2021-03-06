import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddItemForm from './AddItemForm';
import { TaskStatuses, TaskType } from './api/todolists-api';
import './App.css';
import { AppRootState } from './state/store';
import { addTaskTC, updateTaskTC, removeTaskTC } from './state/tasks-reducer';
import { addTodolistTC, changeTodolistFilterAC, changeTodolistTitleTC, fetchTodolistsTC, FilterValuesType, removeTodolistTC, TodolistDomainType } from './state/todolists-reducer';
import TodoList from './TodoList'



export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const dispatch = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodolistDomainType>>( state => state.todolists )
    const tasks = useSelector<AppRootState, TasksStateType>( state => state.tasks )

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])


    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(id, todolistId))
    }, [dispatch])

    const addTask = useCallback((newTaskTitle: string, todolistId: string) => {
        dispatch(addTaskTC(newTaskTitle, todolistId))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(taskId, { status }, todolistId))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(taskId, { title: newTitle } , todolistId))
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(id, newTitle))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(value, todolistId))
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

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
                            let tasksForTodoList = tasks[tl.id]

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


export default AppWithRedux;
