import { Grid, Paper } from "@material-ui/core"
import React, { FC, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TaskStatuses } from "../../api/todolists-api"
import { AppRootState } from "../../app/store"
import AddItemForm from "../../components/AddItemForm/AddItemForm"
import { TasksStateType, removeTaskTC, addTaskTC, updateTaskTC } from "./tasks-reducer"
import TodoList from "./Todolist/TodoList"
import { TodolistDomainType, fetchTodolistsTC, changeTodolistTitleTC, FilterValuesType, changeTodolistFilterAC, removeTodolistTC, addTodolistTC } from "./todolists-reducer"

type PropsType = {
    demo?: boolean
}

const TodolistsList: FC<PropsType> = ({demo = false}) => {
    const dispatch = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)

    useEffect(() => {
        if(demo) {return}
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
        dispatch(updateTaskTC(taskId, { title: newTitle }, todolistId))
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

    return (<>
        <Grid container style={{ padding: '25px' }}>
            <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={5}>
            {
                todolists.map((tl) => {
                    let tasksForTodoList = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper elevation={2} style={{ padding: '10px' }}>
                            <TodoList
                                todolist={tl}
                                tasks={tasksForTodoList}
                                removeTask={removeTask}
                                addTask={addTask}
                                changeFilter={changeFilter}
                                changeTaskStatus={changeStatus}
                                changeTaskTitle={changeTaskTitle}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle} 
                                demo={demo}/>
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
    )
}

export default TodolistsList