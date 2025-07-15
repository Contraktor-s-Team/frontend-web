import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FALIURE, LOGOUT, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_REQUEST, RESET_PASSWORD_FALIURE, FORGOT_PASSWORD_FALIURE, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_REQUEST, VALIDATE_REQUEST, VALIDATE_FALIURE, VALIDATE_SUCCESS } from './LoginType'
import axios from 'axios'
export const loginrequest=()=>{
    return{
        type:LOGIN_REQUEST
    }
}
export const loginsuccess=(response)=>{
    return{
        type:LOGIN_SUCCESS,
        payload: response
    }
}
export const loginfaliure=(error)=>{
    return{
        type:LOGIN_FALIURE,
        payload: error
    }
}
export const logoutrequest=()=>{
    return{
        type:LOGOUT,
        payload:{}
    }
}

export const resetPasswordRequest=()=>{
    return{
        type:RESET_PASSWORD_REQUEST
    }
}
export const resetPasswordSuccess=(response)=>{
    return{
        type:RESET_PASSWORD_SUCCESS,
        payload: response
    }
}
export const resetPasswordFaliure=(error)=>{
    return{
        type:RESET_PASSWORD_FALIURE,
        payload: error
    }
}

export const forgotPasswordRequest=()=>{
    return{
        type:FORGOT_PASSWORD_REQUEST
    }
}
export const forgotPasswordSuccess=(response)=>{
    return{
        type:FORGOT_PASSWORD_SUCCESS,
        payload: response
    }
}
export const forgotPasswordFaliure=(error)=>{
    return{
        type:FORGOT_PASSWORD_FALIURE,
        payload: error
    }
}

export const validateRequest=()=>{
    return{
        type:VALIDATE_REQUEST
    }
}
export const validateSuccess=(response)=>{
    return{
        type:VALIDATE_SUCCESS,
        payload: response
    }
}
export const validateFaliure=(error)=>{
    return{
        type:VALIDATE_FALIURE,
        payload: error
    }
}

const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/auth'

export const loginaction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(loginrequest())
        try{
            const res = await axios.post(`${baseUrl}/login`, postState)
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(loginsuccess(data))
            if(res.status){
                history()
                localStorage.setItem("auth", JSON.stringify(res.data));
            }
        }
        catch(error){
            console.log(error)
            dispatch(loginfaliure(error.response.data.message))
            errors()
        }
    }
}

export const forgotPasswordAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(forgotPasswordRequest())
        try{
            const res = await axios.post(`${baseUrl}/forgot-password`, postState)
            const {data} = res 
            dispatch(forgotPasswordSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            console.log(error)
            dispatch(forgotPasswordFaliure(error.response.data.message))
            errors()
        }
    }
}

export const resetPasswordAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(resetPasswordRequest())
        try{
            const res = await axios.post(`${baseUrl}/reset-password`, postState)
            const {data} = res 
            dispatch(resetPasswordSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            console.log(error)
            dispatch(resetPasswordFaliure(error.response.data.message))
            errors()
        }
    }
}

export const validateAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(validateRequest())
        try{
            const res = await axios.post(`${baseUrl}/validate-reset-code`, postState)
            const {data} = res 
            dispatch(validateSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            console.log(error)
            dispatch(validateFaliure(error.response.data.message))
            errors()
        }
    }
}

export const logout =()=>{
    return (dispatch)=>{
        dispatch(logoutrequest())
        localStorage.clear("auth")
    }
}