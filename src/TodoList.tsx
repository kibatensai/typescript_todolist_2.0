import { Button, Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { ChangeEvent, memo, useCallback } from 'react'
import AddItemForm from './AddItemForm'
import { FilterValuesType } from './App'
import EditableSpan from './EditableSpan'
import { Task } from './Task'

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskObjType>
    removeTask: (id: string, todolistId: string) => void
    addTask: (newTaskTitle: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    filter: FilterValuesType
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void

}

export type TaskObjType = {
    id: string,
    title: string,
    isDone: boolean
}

const TodoList = memo((props: TodoListPropsType) => {

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id])
    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }

    const changeTodolistTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(props.id, newTitle)
    }, [props.changeTodolistTitle, props.id])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    let tasksForTodolist = props.tasks

    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.isDone === true)
    }
    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.isDone === false)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodolistTitle} /> 
                <IconButton onClick={removeTodolist}>
                    <Delete />
                </IconButton>
            </h3>
                <AddItemForm addItem={addTask} />
            <div>
                {
                    tasksForTodolist.map(t => <Task task={t}
                                            changeTaskStatus={props.changeTaskStatus}
                                            changeTaskTitle={props.changeTaskTitle}
                                            removeTask={props.removeTask}
                                            todolistId={props.id}
                                            key={t.id} />)
                }
            </div>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : 'text'} className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</Button>
                <Button color={'primary'} variant={props.filter === 'active' ? 'contained' : 'text'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={'secondary'} variant={props.filter === 'completed' ? 'contained' : 'text'} onClick={onCompletedClickHandler}>Completed</Button>
            </div>
        </div>
    )
})

export default TodoList