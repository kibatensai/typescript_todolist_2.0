import React from 'react'
import AppWithRedux from './AppWithRedux';

import {ReduxStoreProviderDecorator} from './stories/decorators/ReduxStorePrivoderDecorator'

export default {
    title: 'AppWithRedux Component',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]
}

export const AppWithReduxBaseExample = () => {
    return <>
            <AppWithRedux/>
           </>
}