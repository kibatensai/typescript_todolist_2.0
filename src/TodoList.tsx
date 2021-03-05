import { Button, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, {  memo, useCallback } from 'react'
import AddItemForm from './AddItemForm'
import { TaskStatuses, TaskType } from './api/todolists-api'
import EditableSpan from './EditableSpan'
import { FilterValuesType } from './state/todolists-reducer'
import { Task } from './Task'

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (newTaskTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    filter: FilterValuesType
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void

}



const TodoList = memo(({id, title, tasks, filter, 
        removeTask, addTask, changeFilter, changeTaskStatus, 
        changeTaskTitle,  removeTodolist, changeTodolistTitle}: TodoListPropsType) => {

    const onAllClickHandler = useCallback(() => changeFilter('all', id), [changeFilter, id])
    const onActiveClickHandler = useCallback(() => changeFilter('active', id), [changeFilter, id])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', id), [changeFilter, id])
    const removeTodolistHandler = () => {
        removeTodolist(id)
    }

    const changeTodolistTitleHandler = useCallback((newTitle: string) => {
        changeTodolistTitle(id, newTitle)
    }, [changeTodolistTitle, id])

    const addTaskHandler = useCallback((title: string) => {
        addTask(title, id)
    }, [addTask, id])

    let tasksForTodolist = tasks

    if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={title} onChange={changeTodolistTitleHandler} /> 
                <IconButton onClick={removeTodolistHandler}>
                    <Delete />
                </IconButton>
            </h3>
                <AddItemForm addItem={addTaskHandler} />
            <div>
                {
                    tasksForTodolist.map(t => <Task task={t}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTaskTitle={changeTaskTitle}
                                            removeTask={removeTask}
                                            todolistId={id}
                                            key={t.id} />)
                }
            </div>
            <div>
                <Button variant={filter === 'all' ? 'contained' : 'text'} className={filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</Button>
                <Button color={'primary'} variant={filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={'secondary'} variant={filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    )
})

export default TodoList