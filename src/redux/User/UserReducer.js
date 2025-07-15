import { 
    UPDATE_USER_FALIURE, 
    UPDATE_USER_REQUEST, 
    UPDATE_USER_SUCCESS, 
    USER_EMAIL_FALIURE, 
    USER_EMAIL_REQUEST, 
    USER_EMAIL_SUCCESS, 
    USER_FALIURE, 
    USER_REQUEST, 
    USER_SUCCESS 
} from "./UserType"

const initialstate = {
    loading: false,
    data: {},
    error: {}
}

// REDUCER for the /api/Users/by-email endpoint
export const userEmailReducer = (state=initialstate, action) => {
    switch (action.type){
        case USER_EMAIL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case USER_EMAIL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case USER_EMAIL_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

// REDUCER for the /api/Users/{id} endpoint
export const userReducer = (state=initialstate, action) => {
    switch (action.type){
        case USER_REQUEST:
            return{
                ...state,
                loading: true
            }
        case USER_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case USER_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

// REDUCER for the /api/Users/{id} endpoint
export const updateUserReducer = (state=initialstate, action) => {
    switch (action.type){
        case UPDATE_USER_REQUEST:
            return{
                ...state,
                loading: true
            }
        case UPDATE_USER_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case UPDATE_USER_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}