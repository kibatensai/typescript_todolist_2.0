import React from 'react';
import { action } from '@storybook/addon-actions'
import { Task } from './features/TodolistsList/Todolist/Task/Task';
import { TaskPriorities, TaskStatuses } from './api/todolists-api';

export default {
    title: 'Task Component',
    component: Task
}

const changeTaskStatusCallback = action(`Status changed`)
const changeTaskTitleCallback = action(`Task title changed`)
const removeTaskCallback = action(`Task removed`)

export const TaskBaseExample = () => {
    return <>
            <Task
                task={ {id: '1', status: TaskStatuses.Completed, title: 'TestTitle1', todoListId: 'todolistId1', description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}}
                todolistId={'todolistId1'}
                changeTaskStatus={changeTaskStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
                removeTask={removeTaskCallback}

                 />
            <Task
                task={ {id: '2', status: TaskStatuses.New, title: 'TestTitle2', todoListId: 'todolistId2', description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low}}
                todolistId={'todolistId2'}
                changeTaskStatus={changeTaskStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
                removeTask={removeTaskCallback}
                 />
            </>
}