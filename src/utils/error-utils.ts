import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "../app/app-reducer"
import {ResponseType} from '../api/todolists-api'
import { Dispatch } from "redux"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (err: { message: string }, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppErrorAC({error: err.message ? err.message : 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}