import { ALL_ARTISAN_FALIURE, ALL_ARTISAN_REQUEST, ALL_ARTISAN_SUCCESS, ARTISAN_ASSIGNMENT_FALIURE, ARTISAN_ASSIGNMENT_REQUEST, ARTISAN_ASSIGNMENT_SUCCESS, ARTISAN_FALIURE, ARTISAN_REQUEST, ARTISAN_SUCCESS } from "./ArtisanType"

const initialstate = {
    loading: false,
    data: {},
    error: {}
}

export const allArtisanReducer = (state=initialstate, action) => {
    switch (action.type){
        case ALL_ARTISAN_REQUEST:
            return{
                ...state,
                loading: true
            }
        case ALL_ARTISAN_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case ALL_ARTISAN_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}


export const artisanReducer = (state=initialstate, action) => {
    switch (action.type){
        case ARTISAN_REQUEST:
            return{
                ...state,
                loading: true
            }
        case ARTISAN_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case ARTISAN_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const artisanAssignmentReducer = (state=initialstate, action) => {
    switch (action.type){
        case ARTISAN_ASSIGNMENT_REQUEST:
            return{
                ...state,
                loading: true
            }
        case ARTISAN_ASSIGNMENT_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case ARTISAN_ASSIGNMENT_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}
