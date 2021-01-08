import React, { KeyboardEvent, ChangeEvent, useState} from 'react'

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

const AddItemForm = (props: AddItemFormPropsType) => {

    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTaskTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addNewTask()
            setNewTaskTitle('')
        }
    }

    const addNewTask = () => {
        if (newTaskTitle.trim() !== '') { 
            props.addItem(newTaskTitle.trim())
            setNewTaskTitle('')
            setError(null)
        } else {
            setError('Title is required')
        }
    }

    return (
        <div>
        <input value={newTaskTitle}
            onChange={onNewTaskTitleChangeHandler}
            onKeyPress={onKeyPressHandler}
            className={error ? 'error' : ''}
        />
        <button onClick={addNewTask}>+</button>
        {error && <div className='error-message'>{error}</div>}
    </div>
    )
}

export default AddItemForm