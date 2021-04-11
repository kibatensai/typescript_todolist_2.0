import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { FC, useCallback, useEffect } from 'react';
import './App.css';
import TodolistsList from '../features/TodolistsList/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAppTC, RequestStatusType } from './app-reducer';
import { AppRootState } from './store';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Login } from '../features/Login/Login';
import { logoutTC } from '../features/Login/auth-reducer';


type PropsType = {
    demo?: boolean
}

const App: FC<PropsType> = ({demo = false}) => {
    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootState, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!demo) {
        dispatch(initializeAppTC())
        }
    }, [])

    const logoutHandler = useCallback(()=> {
        dispatch(logoutTC())
    }, [])

    if(!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress />
            </div>
    }

    return (

        <div className="App">
            <ErrorSnackbar />
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <Menu />
                    </IconButton>
                    <Typography variant='h6'>
                        News
                    </Typography>
                    {isLoggedIn && <Button color='inherit' onClick={logoutHandler}>Log Out</Button>}
                </Toolbar>
            </AppBar>
            <Container fixed>
                {status === 'loading' && <LinearProgress />}
                <Switch>
                    <Route exact path={'/'}>
                        <TodolistsList demo={demo}/>
                    </Route>
                    <Route path={'/login'}>
                        <Login />
                    </Route>
                    <Route path={'/404'}>
                        <h1>404: PAGE NOT FOUND</h1>
                    </Route>
                    <Redirect from={'*'} to={'/404'} />
                </Switch>
            </Container>
        </div>
    );
}



export default App;
