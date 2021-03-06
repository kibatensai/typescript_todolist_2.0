import React, { useEffect, useState } from 'react'
import { TaskPriorities, todolistsAPI, UpdateTaskModelType } from '../api/todolists-api'

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '5675685f-9cd0-43c9-b668-1f134f354acb'
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.getTodolists()
            .then(({ data }) => {
                setState(data)
            })
    }, [])

    return <div> {JSON.stringify(state)} </div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.createTodolist('darova')
            .then(({ data }) => {
                setState(data)
            })

    }, [])

    return <div> {JSON.stringify(state)} </div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTodolist = () => {
        todolistsAPI.deleteTodolist(todolistId)
        .then(({ data }) => {
            setState(data)
        })
    }

    return <div> {JSON.stringify(state)} <div>
    <input placeholder={'todolistId'} value={todolistId}
        onChange={e => setTodolistId(e.currentTarget.value)} />
    <button onClick={deleteTodolist}>delete Todolist</button>
</div>
</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.updateTodolistTitle('f323437b-b6d4-4ead-b50d-f43517535766', 'privet')
            .then(({ data }) => {
                setState(data)
            })

    }, [])

    return <div> {JSON.stringify(state)} </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTasks = () => {
        todolistsAPI.getTasks(todolistId)
            .then(({ data }) => {
                setState(data)
            })
    }

    return <div> {JSON.stringify(state)} <div>
    <input placeholder={'todolistId'} value={todolistId}
        onChange={e => setTodolistId(e.currentTarget.value)} />
    <button onClick={getTasks}>get tasks</button>
</div>
</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTask = () => {
        todolistsAPI.deleteTask('bb927a74-57dd-47fa-92e1-85378b79dcb9', '')
            .then(({ data }) => {
                setState(data)
            })
    }

    return <div> {JSON.stringify(state)} <div>
        <input placeholder={'todolistId'} value={todolistId}
            onChange={e => setTodolistId(e.currentTarget.value)} />
        <input placeholder={'taskTitle'} value={taskId}
            onChange={e => setTaskId(e.currentTarget.value)} />
                <button onClick={deleteTask}>delete task</button>
    </div>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const createTask = () => {
        todolistsAPI.createTask(todolistId, taskTitle)
            .then(({ data }) => {
                setState(data)
            })
    }

    return <div> {JSON.stringify(state)} <div>
        <input placeholder={'todolistId'} value={todolistId}
            onChange={e => setTodolistId(e.currentTarget.value)} />
        <input placeholder={'taskTitle'} value={taskTitle}
            onChange={e => setTaskTitle(e.currentTarget.value)} />
        <button onClick={createTask}>create task</button>
    </div>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')

    const [description, setDescription] = useState<string>('')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')


    const model: UpdateTaskModelType = {
        deadline: deadline,
        description: description,
        priority: priority,
        startDate: startDate,
        title: taskTitle,
        status: status
    }

    const updateTask = () => {
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then(({ data }) => {
                setState(data)
            })
    }

    return <div> {JSON.stringify(state)} <div>
        <input placeholder={'todolist ID'} value={todolistId}
            onChange={e => setTodolistId(e.currentTarget.value)} />
        <input placeholder={'task ID'} value={taskId}
            onChange={e => setTaskId(e.currentTarget.value)} />
        <input placeholder={'taskTitle'} value={taskTitle}
            onChange={e => setTaskTitle(e.currentTarget.value)} />
        <button onClick={updateTask}>update task</button>
    </div>
    </div>
}