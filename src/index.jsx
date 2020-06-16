import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import routes from '@routes'

/* ErrorBoundary */
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary'

import '@style/global.scss'

ReactDOM.render(
    <HashRouter>
        <ErrorBoundary>{routes}</ErrorBoundary>
    </HashRouter>,
    document.getElementById('root')
)
