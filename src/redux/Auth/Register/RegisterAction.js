import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FALIURE, VALIDATE_EMAIL_REQUEST, VALIDATE_EMAIL_SUCCESS, VALIDATE_EMAIL_FALIURE, CONFIRM_EMAIL_FALIURE, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_REQUEST } from "./RegisterType";
import {auth, googleProvider, facebookProvider} from "./Config";
import {signInWithPopup} from "firebase/auth";
import axios from 'axios'
import { data } from "react-router-dom";

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

export const externalRegister = (providerName, history) => {
    return async (dispatch) => {
        let provider;
        if (providerName === "Google") provider = googleProvider;
        else if (providerName === "Facebook") provider = facebookProvider;
        else throw new Error("Unsupported provider");
        dispatch(registerRequest())
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result._tokenResponse.oauthIdToken;
            console.log("External registration successful", result, token);
            // Optional: Generate a random password or ask the backend to ignore it
            const password = crypto.randomUUID(); // you can generate or use a constant

            const payload = {
            provider: providerName,
            token,
            password,
            };
            const response = await axios.post(`${baseUrl}/external-register`, payload);
            console.log("Registration successful", response);
            if(response.status === 200){
                history()
                localStorage.setItem("auth", JSON.stringify(response.data));
                dispatch(registerSuccess({response:response.data, email:result.user.email}))
            }
            
            return response.data;
        } catch (error) {
            dispatch(registerFaliure(error))
            console.error("External registration failed:", error);
            throw error;
        }
    }
};


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