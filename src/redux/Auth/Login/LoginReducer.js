import { FORGOT_PASSWORD_FALIURE, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, LOGIN_FALIURE, LOGIN_REQUEST, LOGIN_SUCCESS, RESET_PASSWORD_FALIURE, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, VALIDATE_FALIURE, VALIDATE_REQUEST, VALIDATE_SUCCESS } from "./LoginType"

const initialstate = {
    loading: false,
    data: {},
    error: {},
    isAuthenticated: false,
    token: null,
}


// REDUCER for the /api/Auth/login endpoint
export const loginReducer = (state=initialstate, action) => {
    switch (action.type){
        case LOGIN_REQUEST:
            return{
                ...state,
                loading: true
            }
        case LOGIN_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {},
                isAuthenticated: true,
                token: action.payload.token
            }
        case LOGIN_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload,
                isAuthenticated: false,
                token: null
            }
        default: return state   
    }
}
// REDUCER for the /api/Auth/login endpoint
export const resetPasswordReducer = (state=initialstate, action) => {
    switch (action.type){
        case RESET_PASSWORD_REQUEST:
            return{
                ...state,
                loading: true
            }
        case RESET_PASSWORD_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {},
            }
        case RESET_PASSWORD_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload,
            }
        default: return state   
    }
}


// REDUCER for the /api/Auth/register endpoint
export const forgotPasswordReducer = (state=initialstate, action) => {
    switch (action.type){
        case FORGOT_PASSWORD_REQUEST:
            return{
                ...state,
                loading: true
            }
        case FORGOT_PASSWORD_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {},
            }
        case FORGOT_PASSWORD_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload,
            }
        default: return state   
    }
}

export const validateReducer = (state=initialstate, action) => {
    switch (action.type){
        case VALIDATE_REQUEST:
            return{
                ...state,
                loading: true
            }
        case VALIDATE_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {},
            }
        case VALIDATE_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload,
            }
        default: return state   
    }
}