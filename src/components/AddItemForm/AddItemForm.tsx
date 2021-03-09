import { IconButton, TextField } from '@material-ui/core'
import { ControlPoint } from '@material-ui/icons'
import React, { KeyboardEvent, ChangeEvent, useState, memo} from 'react'

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

const AddItemForm = memo((props: AddItemFormPropsType) => {

    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTaskTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) { setError(null) }
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
        <TextField style={ { padding: '5px' } }
            label={'Type value'}
            value={newTaskTitle}
            onChange={onNewTaskTitleChangeHandler}
            onKeyPress={onKeyPressHandler}
            error={!!error}
            helperText={error}
        />
        <IconButton onClick={addNewTask} color={'primary'}>
            <ControlPoint />
        </IconButton>

        {/* {error && <div className='error-message'>{error}</div>} */}
    </div>
    )
})

export default AddItemForm