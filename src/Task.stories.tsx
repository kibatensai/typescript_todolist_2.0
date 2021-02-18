import React from 'react';
import { action } from '@storybook/addon-actions'
import { Task } from './Task';

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
                task={ {id: '1', isDone: true, title: 'TestTitle1'}}
                todolistId={'todolistId1'}
                changeTaskStatus={changeTaskStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
                removeTask={removeTaskCallback}

                 />
            <Task
                task={ {id: '2', isDone: false, title: 'TestTitle2'}}
                todolistId={'todolistId2'}
                changeTaskStatus={changeTaskStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
                removeTask={removeTaskCallback}
                 />
            </>
}