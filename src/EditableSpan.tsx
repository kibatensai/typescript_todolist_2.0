import { TextField } from '@material-ui/core'
import React, { ChangeEvent, useState, KeyboardEvent } from 'react'

type EditableSpanPropsType = {
    title: string
    onChange: (newValue: string) => void
}

const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            activateViewMode()
        }
    }

    return ( editMode
        ? <TextField value={title} onChange={onChangeTitleHandler} onBlur={activateViewMode} onKeyPress={onKeyPressHandler} autoFocus />
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
    )
}

export default EditableSpan