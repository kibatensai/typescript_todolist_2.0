import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Dispatch } from "redux"
import { authAPI } from "../api/todolists-api"
import { setIsLoggedInAC } from "../features/Login/auth-reducer"

const initialState: InitialStateType = {
    status: 'idle' as RequestStatusType,
    error: null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppInitializedAC: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const { setAppErrorAC, setAppStatusAC, setAppInitializedAC } = slice.actions


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(({ data }) => {
            if(data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            } else {

            }
            dispatch(setAppInitializedAC({isInitialized: true}))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // if there's any restful operation
    status: RequestStatusType
    // if an error exists - it goes here
    error: string | null
    // true if app is initialized (checked user credentials, got positive response etc.)
    isInitialized: boolean
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>