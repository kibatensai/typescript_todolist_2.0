import { AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { FC } from 'react';
import './App.css';
import TodolistsList from '../features/TodolistsList/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar';
import { useSelector } from 'react-redux';
import { RequestStatusType } from './app-reducer';
import { AppRootState } from './store';


type PropsType = {
    demo?: boolean
}

const App: FC<PropsType> = ({demo = false}) => {
    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
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
                    <Button color='inherit'>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                {status === 'loading' && <LinearProgress />}
                <TodolistsList demo={demo}/>
            </Container>
        </div>
    );
}



export default App;
