import { ARTISAN_JOB_FALIURE, ARTISAN_JOB_REQUEST, ARTISAN_JOB_SUCCESS, CATEGORY_FALIURE, CATEGORY_REQUEST, CATEGORY_SUCCESS, DELETE_JOB_FALIURE, DELETE_JOB_REQUEST, DELETE_JOB_SUCCESS, JOB_FALIURE, JOB_ID_FALIURE, JOB_ID_REQUEST, JOB_ID_SUCCESS, JOB_REQUEST, JOB_SUCCESS, POST_JOB_FALIURE, POST_JOB_REQUEST, POST_JOB_SUCCESS, SUBCATEGORY_FALIURE, SUBCATEGORY_REQUEST, SUBCATEGORY_SUCCESS } from "./JobsType"

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

export const deleteJobReducer = (state=initialstate, action) => {
    switch (action.type){
        case DELETE_JOB_REQUEST:
            return{
                ...state,
                loading: true
            }
        case DELETE_JOB_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case DELETE_JOB_FALIURE:
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

export const categoryReducer = (state=initialstate, action) => {
    switch (action.type){
        case CATEGORY_REQUEST:
            return{
                ...state,
                loading: true
            }
        case CATEGORY_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case CATEGORY_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const subCategoryReducer = (state=initialstate, action) => {
    switch (action.type){
        case SUBCATEGORY_REQUEST:
            return{
                ...state,
                loading: true
            }
        case SUBCATEGORY_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case SUBCATEGORY_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const artisanJobReducer = (state=initialstate, action) => {
    switch (action.type){
        case ARTISAN_JOB_REQUEST:
            return{
                ...state,
                loading: true
            }
        case ARTISAN_JOB_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case ARTISAN_JOB_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}