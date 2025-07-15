import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FALIURE, VALIDATE_EMAIL_REQUEST, VALIDATE_EMAIL_SUCCESS, VALIDATE_EMAIL_FALIURE, CONFIRM_EMAIL_REQUEST, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_FALIURE } from "./RegisterType";

const initialstate = {
    loading: false,
    data: {},
    error: {}
}

// REDUCER for the /api/Auth/register endpoint
export const registerReducer = (state=initialstate, action) => {
    switch (action.type){
        case REGISTER_REQUEST:
            return{
                ...state,
                loading: true
            }
        case REGISTER_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case REGISTER_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

// REDUCER for the /api/Auth/validate-email endpoint
export const validateEmailReducer = (state=initialstate, action) => {
    switch (action.type){
        case VALIDATE_EMAIL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case VALIDATE_EMAIL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case VALIDATE_EMAIL_FALIURE:
            return{         
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

// REDUCER for the /api/Auth/confirm-email-validation endpoint
export const confirmEmailReducer = (state=initialstate, action) => {
    switch (action.type){
        case CONFIRM_EMAIL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case CONFIRM_EMAIL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case CONFIRM_EMAIL_FALIURE:
            return{         
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}