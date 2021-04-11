import React from 'react'
import App from './App';

import { BrowserRouterDecorator, ReduxStoreProviderDecorator } from '../stories/decorators/ReduxStorePrivoderDecorator'

export default {
    title: 'App Component',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
}

export const AppBaseExample = () => {
    return <>
        <App demo={true} />
    </>
}