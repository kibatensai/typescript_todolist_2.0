import React from 'react';
import { action } from '@storybook/addon-actions'
import EditableSpan from './EditableSpan';

export default {
    title: 'EditableSpan Component',
    component: EditableSpan
}

const onChangeCallback = action(`Value changed`)


export const EditableSpanBaseExample = () => {
    return <>
                <EditableSpan title={'Test title'} onChange={onChangeCallback}/>
           </>
}