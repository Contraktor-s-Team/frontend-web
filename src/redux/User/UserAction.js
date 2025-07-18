import axios from "axios"
import { UPDATE_USER_FALIURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, USER_EMAIL_FALIURE, USER_EMAIL_REQUEST, USER_EMAIL_SUCCESS, USER_FALIURE, USER_REQUEST, USER_SUCCESS } from "./UserType"

// this is for /api/Auth/register endpoint
export const userEmailRequest=()=>{
    return{
        type:USER_EMAIL_REQUEST
    }
}
export const userEmailSuccess=(response)=>{
    return{
        type:USER_EMAIL_SUCCESS,
        payload: response
    }
}

export const userEmailFaliure=(error)=>{
    return{
        type:USER_EMAIL_FALIURE,
        payload: error
    }
}

// this is for /api/Auth/register endpoint
export const userRequest=()=>{
    return{
        type:USER_REQUEST
    }
}
export const userSuccess=(response)=>{
    return{
        type:USER_SUCCESS,
        payload: response
    }
}

export const userFaliure=(error)=>{
    return{
        type:USER_FALIURE,
        payload: error
    }
}

export const updateUserRequest=()=>{
    return{
        type: UPDATE_USER_REQUEST
    }
}
export const updateUserSuccess=(response)=>{
    return{
        type: UPDATE_USER_SUCCESS,
        payload: response
    }
}

export const updateUserFaliure=(error)=>{
    return{
        type: UPDATE_USER_FALIURE,
        payload: error
    }
}

const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Users'

// this is for /api/Users/by-email endpoint
export const userEmailAction = (email) =>{
    return async (dispatch) => {
        dispatch(userEmailRequest())
        await axios.get(`${baseUrl}/by-email?email=${email}`)
        .then(response=>{
            const data = response.data;
            dispatch(userEmailSuccess(data))
        }).catch(error=>{
            dispatch(userEmailFaliure(error.response.data.message))
        })
    }
}

// this is for /api/Users/{id} endpoint
export const userAction = (id) =>{
    return async (dispatch) => {
        dispatch(userRequest())
        await axios.get(`${baseUrl}/${id}`)
        .then(response=>{
            const data = response.data;
            dispatch(userSuccess(data))
        }).catch(error=>{
            dispatch(userFaliure(error.response.data.message))
        })
    }
}

export const updateUserAction = (id, postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(updateUserRequest())
        try{
            const res = await axios.post(`${baseUrl}/${id}/update`, postState)
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(updateUserSuccess(data))
            if(res.status){
                history()
            }
        }
        catch(error){
            dispatch(updateUserFaliure(error.response.data.message))
            errors()
        }
    }
}