import { ARTISAN_PROPOSAL_FAILURE, ARTISAN_PROPOSAL_REQUEST, ARTISAN_PROPOSAL_SUCCESS, GET_NEGOTIATION_FAILURE, GET_NEGOTIATION_REQUEST, GET_NEGOTIATION_SUCCESS, JOB_PROPOSAL_FAILURE, JOB_PROPOSAL_REQUEST, JOB_PROPOSAL_SUCCESS, NEGOTIATE_PROPOSAL_FAILURE, NEGOTIATE_PROPOSAL_REQUEST, NEGOTIATE_PROPOSAL_SUCCESS, POST_PROPOSAL_FAILURE, POST_PROPOSAL_REQUEST, POST_PROPOSAL_SUCCESS } from "./ProposalType"


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
        case POST_PROPOSAL_FAILURE:
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
        case JOB_PROPOSAL_FAILURE:
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
        case ARTISAN_PROPOSAL_FAILURE:
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
        case NEGOTIATE_PROPOSAL_FAILURE:
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
        case GET_NEGOTIATION_FAILURE:
            return{
                loading:false,
                data: {},
                error: action.payload
            }
        default: return state   
    }
}

