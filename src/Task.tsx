import { Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { ChangeEvent, memo, useCallback } from 'react'
import { TaskStatuses, TaskType } from './api/todolists-api'
import EditableSpan from './EditableSpan'

type TaskPropsType = {
    task: TaskType
    todolistId: string
    removeTask: (id: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void

}

export const Task = memo(({task, todolistId, removeTask, changeTaskStatus, changeTaskTitle}: TaskPropsType) => {
    const onRemoveHandler = () => { removeTask(task.id, todolistId) }

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, todolistId)
    }

    const onChangeTitleHandler = useCallback((newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId)
    }, [changeTaskTitle, task.id, todolistId])

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            onChange={onChangeStatusHandler}
            checked={task.status === TaskStatuses.Completed} />
        <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
        <IconButton onClick={onRemoveHandler}>
            <Delete />
        </IconButton>
    </div>
})
