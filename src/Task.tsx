import { Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { ChangeEvent, memo, useCallback } from 'react'
import EditableSpan from './EditableSpan'
import { TaskObjType } from './TodoList'

type TaskPropsType = {
    todolistId: string
    removeTask: (id: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    task: TaskObjType
}

export const Task = memo((props: TaskPropsType) => {
    const onRemoveHandler = () => { props.removeTask(props.task.id, props.todolistId) }

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.task.id, e.currentTarget.checked, props.todolistId)
    }

    const onChangeTitleHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.changeTaskTitle, props.task.id, props.todolistId])

    return <div key={props.task.id} className={props.task.isDone ? 'is-done' : ''}>
        <Checkbox
            onChange={onChangeStatusHandler}
            checked={props.task.isDone} />
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler} />
        <IconButton onClick={onRemoveHandler}>
            <Delete />
        </IconButton>
    </div>
})
