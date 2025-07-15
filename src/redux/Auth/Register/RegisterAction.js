import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FALIURE, VALIDATE_EMAIL_REQUEST, VALIDATE_EMAIL_SUCCESS, VALIDATE_EMAIL_FALIURE, CONFIRM_EMAIL_FALIURE, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_REQUEST } from "./RegisterType";
import axios from 'axios'

// this is for /api/Auth/register endpoint
export const registerRequest=()=>{
    return{
        type:REGISTER_REQUEST
    }
}
export const registerSuccess=(response)=>{
    return{
        type:REGISTER_SUCCESS,
        payload: response
    }
}

export const registerFaliure=(error)=>{
    return{
        type:REGISTER_FALIURE,
        payload: error
    }
}

// this is for /api/Auth/validate-email endpoint
export const validateEmailRequest=()=>{
    return{
        type: VALIDATE_EMAIL_REQUEST
    }
}
export const validateEmailSuccess=(response)=>{
    return{
        type: VALIDATE_EMAIL_SUCCESS,
        payload: response
    }
}

export const validateEmailFaliure=(error)=>{
    return{
        type: VALIDATE_EMAIL_FALIURE,
        payload: error
    }
}

// this is for /api/Auth/confirm-email-validation endpoint
export const confirmEmailRequest=()=>{
    return{
        type: CONFIRM_EMAIL_REQUEST
    }
}
export const confirmEmailSuccess=(response)=>{
    return{
        type: CONFIRM_EMAIL_SUCCESS,
        payload: response
    }
}

export const confirmEmailFaliure=(error)=>{
    return{
        type: CONFIRM_EMAIL_FALIURE,
        payload: error
    }
}

const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/auth'

// this is for /api/Auth/register endpoint
export const registerAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(registerRequest())
        try{
            const res = await axios.post(`${baseUrl}/register`, postState)
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(registerSuccess(data))
            if(res.status){
                history()
                localStorage.setItem("auth", JSON.stringify(res.data));
            }
        }
        catch(error){
            dispatch(registerFaliure(error.response.data.message))
            errors()
        }
    }
}

// this is for /api/Auth/validate-email endpoint
export const ValidateEmailAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(validateEmailRequest())
        try{
        const res = await axios.post(
            `${baseUrl}/validate-email`,
            JSON.stringify(postState),
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(validateEmailSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            dispatch(validateEmailFaliure(error.response.data.message))
            errors()
        }
    }
}

// this is for /api/Auth/confirm-email-validation endpoint
export const ConfirmEmailAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(confirmEmailRequest())
        try{
            const res = await axios.post(`${baseUrl}/confirm-email-validation`, postState)
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(confirmEmailSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            dispatch(confirmEmailFaliure(error.response.data.message))
            errors()
        }
    }
}