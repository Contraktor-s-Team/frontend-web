import { JOB_FALIURE, JOB_ID_FALIURE, JOB_ID_REQUEST, JOB_ID_SUCCESS, JOB_REQUEST, JOB_SUCCESS, POST_JOB_FALIURE, POST_JOB_REQUEST, POST_JOB_SUCCESS } from "./JobsType"

const initialstate = {
    loading: false,
    data: {},
    error: {}
}

// REDUCER for the /api/Users/by-email endpoint
export const jobpostReducer = (state=initialstate, action) => {
    switch (action.type){
        case POST_JOB_REQUEST:
            return{
                ...state,
                loading: true
            }
        case POST_JOB_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case POST_JOB_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}


export const jobReducer = (state=initialstate, action) => {
    switch (action.type){
        case JOB_REQUEST:
            return{
                ...state,
                loading: true
            }
        case JOB_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case JOB_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}
export const jobidReducer = (state=initialstate, action) => {
    switch (action.type){
        case JOB_ID_REQUEST:
            return{
                ...state,
                loading: true
            }
        case JOB_ID_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case JOB_ID_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}