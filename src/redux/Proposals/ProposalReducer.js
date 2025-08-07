import { ARTISAN_PROPOSAL_FALIURE, ARTISAN_PROPOSAL_REQUEST, ARTISAN_PROPOSAL_SUCCESS, GET_NEGOTIATION_FALIURE, GET_NEGOTIATION_REQUEST, GET_NEGOTIATION_SUCCESS, JOB_PROPOSAL_FALIURE, JOB_PROPOSAL_REQUEST, JOB_PROPOSAL_SUCCESS, NEGOTIATE_PROPOSAL_FALIURE, NEGOTIATE_PROPOSAL_REQUEST, NEGOTIATE_PROPOSAL_SUCCESS, POST_PROPOSAL_FALIURE, POST_PROPOSAL_REQUEST, POST_PROPOSAL_SUCCESS } from "./ProposalType"


const initialstate = {
    loading: false,
    data: {},
    error: {}
}

// REDUCER for the /api/Users/by-email endpoint
export const proposalPostReducer = (state=initialstate, action) => {
    switch (action.type){
        case POST_PROPOSAL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case POST_PROPOSAL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case POST_PROPOSAL_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const jobProposalReducer = (state=initialstate, action) => {
    switch (action.type){
        case JOB_PROPOSAL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case JOB_PROPOSAL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case JOB_PROPOSAL_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const artisanProposalReducer = (state=initialstate, action) => {
    switch (action.type){
        case ARTISAN_PROPOSAL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case ARTISAN_PROPOSAL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case ARTISAN_PROPOSAL_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

export const negotiateProposalReducer = (state=initialstate, action) => {
    switch (action.type){
        case NEGOTIATE_PROPOSAL_REQUEST:
            return{
                ...state,
                loading: true
            }
        case NEGOTIATE_PROPOSAL_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case NEGOTIATE_PROPOSAL_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}


export const negotiateReducer = (state=initialstate, action) => {
    switch (action.type){
        case GET_NEGOTIATION_REQUEST:
            return{
                ...state,
                loading: true
            }
        case GET_NEGOTIATION_SUCCESS:
            return{
                loading: false,
                data: action.payload,
                error: {}
            }
        case GET_NEGOTIATION_FALIURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

// export const jobidReducer = (state=initialstate, action) => {
//     switch (action.type){
//         case JOB_ID_REQUEST:
//             return{
//                 ...state,
//                 loading: true
//             }
//         case JOB_ID_SUCCESS:
//             return{
//                 loading: false,
//                 data: action.payload,
//                 error: {}
//             }
//         case JOB_ID_FALIURE:
//             return{
//                 loading:false,
//                 data: {},
//                 error: action.payload
//             }
//         default: return state   
//     }
// }

// export const categoryReducer = (state=initialstate, action) => {
//     switch (action.type){
//         case CATEGORY_REQUEST:
//             return{
//                 ...state,
//                 loading: true
//             }
//         case CATEGORY_SUCCESS:
//             return{
//                 loading: false,
//                 data: action.payload,
//                 error: {}
//             }
//         case CATEGORY_FALIURE:
//             return{
//                 loading:false,
//                 data: {},
//                 error: action.payload
//             }
//         default: return state   
//     }
// }

// export const subCategoryReducer = (state=initialstate, action) => {
//     switch (action.type){
//         case SUBCATEGORY_REQUEST:
//             return{
//                 ...state,
//                 loading: true
//             }
//         case SUBCATEGORY_SUCCESS:
//             return{
//                 loading: false,
//                 data: action.payload,
//                 error: {}
//             }
//         case SUBCATEGORY_FALIURE:
//             return{
//                 loading:false,
//                 data: {},
//                 error: action.payload
//             }
//         default: return state   
//     }
// }

// export const artisanJobReducer = (state=initialstate, action) => {
//     switch (action.type){
//         case ARTISAN_JOB_REQUEST:
//             return{
//                 ...state,
//                 loading: true
//             }
//         case ARTISAN_JOB_SUCCESS:
//             return{
//                 loading: false,
//                 data: action.payload,
//                 error: {}
//             }
//         case ARTISAN_JOB_FALIURE:
//             return{
//                 loading:false,
//                 data: {},
//                 error: action.payload
//             }
//         default: return state   
//     }
// }