import { Button, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, {  memo, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AddItemForm from '../../../components/AddItemForm/AddItemForm'
import { TaskStatuses, TaskType } from '../../../api/todolists-api'
import EditableSpan from '../../../components/EditableSpan/EditableSpan'
import { fetchTasksTC } from '../tasks-reducer'
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer'
import { Task } from './Task/Task'

type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (newTaskTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean

}

const TodoList = memo(({todolist, tasks, demo = false,
        removeTask, addTask, changeFilter, changeTaskStatus, 
        changeTaskTitle,  removeTodolist, changeTodolistTitle}: TodoListPropsType) => {

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (demo) {return}
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    const onAllClickHandler = useCallback(() => changeFilter('all', todolist.id), [changeFilter, todolist.id])
    const onActiveClickHandler = useCallback(() => changeFilter('active', todolist.id), [changeFilter, todolist.id])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolist.id), [changeFilter, todolist.id])
    const removeTodolistHandler = () => {
        removeTodolist(todolist.id)
    }

    const changeTodolistTitleHandler = useCallback((newTitle: string) => {
        changeTodolistTitle(todolist.id, newTitle)
    }, [changeTodolistTitle, todolist.id])

    const addTaskHandler = useCallback((title: string) => {
        addTask(title, todolist.id)
    }, [addTask, todolist.id])

    let tasksForTodolist = tasks

    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={todolist.title} onChange={changeTodolistTitleHandler} /> 
                <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                    <Delete />
                </IconButton>
            </h3>
                <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task key={t.id}
                                            task={t}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTaskTitle={changeTaskTitle}
                                            removeTask={removeTask}
                                            todolistId={todolist.id}
                                             />)
                }
            </div>
            <div>
                <Button variant={todolist.filter === 'all' ? 'contained' : 'text'} className={todolist.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</Button>
                <Button color={'primary'} variant={todolist.filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={'secondary'} variant={todolist.filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    )
})

export default TodoList