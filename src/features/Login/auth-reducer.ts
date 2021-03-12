import { Dispatch } from "redux"
import { authAPI, LoginParamsType } from "../../api/todolists-api"
import { SetAppStatusActionType, SetAppErrorActionType, setAppStatusAC } from "../../app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"

const initialState: InitialStateType = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return { ...state, isLoggedIn: action.value }
        default:
            return { ...state }
    }
}

// ------ ACTIONS ------

export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// ------ THUNK ------

export const loginTC = (data: LoginParamsType) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(({data}) => {
            if(data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(data, dispatch)
            }
        })
        .catch( err => {
            handleServerNetworkError(err, dispatch)
        })

}

export const logoutTC = () => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(({data}) => {
            if(data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(data, dispatch)
            }
        })
        .catch( err => {
            handleServerNetworkError(err, dispatch)
        })
}

// ------ TYPES ------

type InitialStateType = {
    isLoggedIn: boolean
}

type ActionsType = ReturnType<typeof setIsLoggedInAC>

type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>