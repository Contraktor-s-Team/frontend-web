/**
 * Proposal Redux Actions
 * 
 * This file implements all Redux actions for the Proposal API endpoints:
 * 
 * ✅ POST /api/Proposal - Create a new proposal
 * ✅ POST /api/Proposal/{proposalId}/negotiate - Negotiate a proposal
 * ✅ GET /api/Proposal/joblisting/{jobId} - Get proposals for a job
 * ✅ GET /api/Proposal/Artisan - Get artisan proposals
 * ✅ GET /api/Proposal/selected/{jobId} - Get selected proposals for a job
 * ✅ POST /api/Proposal/select/{proposalId} - Select a proposal
 * ✅ GET /api/Proposal/{proposalId}/negotiations - Get negotiations for a proposal
 * ✅ GET /api/Proposal/{proposalId}/negotiations/latest - Get latest negotiation
 * ✅ POST /api/Proposal/{negotiationId}/accept - Accept a negotiation
 * ✅ POST /api/Proposal/{negotiationId}/reject - Reject a negotiation
 */

import axios from "axios"
import { 
    ARTISAN_PROPOSAL_FAILURE, ARTISAN_PROPOSAL_REQUEST, ARTISAN_PROPOSAL_SUCCESS, 
    GET_NEGOTIATION_FAILURE, GET_NEGOTIATION_REQUEST, GET_NEGOTIATION_SUCCESS, 
    JOB_PROPOSAL_FAILURE, JOB_PROPOSAL_REQUEST, JOB_PROPOSAL_SUCCESS, 
    NEGOTIATE_PROPOSAL_FAILURE, NEGOTIATE_PROPOSAL_REQUEST, NEGOTIATE_PROPOSAL_SUCCESS, 
    POST_PROPOSAL_FAILURE, POST_PROPOSAL_REQUEST, POST_PROPOSAL_SUCCESS,
    SELECT_PROPOSAL_FAILURE, SELECT_PROPOSAL_REQUEST, SELECT_PROPOSAL_SUCCESS,
    GET_SELECTED_PROPOSALS_FAILURE, GET_SELECTED_PROPOSALS_REQUEST, GET_SELECTED_PROPOSALS_SUCCESS,
    GET_LATEST_NEGOTIATION_FAILURE, GET_LATEST_NEGOTIATION_REQUEST, GET_LATEST_NEGOTIATION_SUCCESS,
    ACCEPT_NEGOTIATION_FAILURE, ACCEPT_NEGOTIATION_REQUEST, ACCEPT_NEGOTIATION_SUCCESS,
    REJECT_NEGOTIATION_FAILURE, REJECT_NEGOTIATION_REQUEST, REJECT_NEGOTIATION_SUCCESS
} from "./ProposalType"

const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Proposal'

// Action Creators
export const postProposalRequest=()=>{
    return{
        type:POST_PROPOSAL_REQUEST
    }
}
export const postProposalSuccess=(response)=>{
    return{
        type:POST_PROPOSAL_SUCCESS,
        payload: response
    }
}

export const postProposalFailure=(error)=>{
    return{
        type:POST_PROPOSAL_FAILURE,
        payload: error
    }
}
export const jobProposalRequest=()=>{
    return{
        type:JOB_PROPOSAL_REQUEST
    }
}
export const jobProposalSuccess=(response)=>{
    return{
        type:JOB_PROPOSAL_SUCCESS,
        payload: response
    }
}
export const jobProposalFailure=(error)=>{
    return{
        type:JOB_PROPOSAL_FAILURE,
        payload: error
    }
}

export const artisanProposalRequest=()=>{
    return{
        type:ARTISAN_PROPOSAL_REQUEST
    }
}
export const artisanProposalSuccess=(response)=>{
    return{
        type:ARTISAN_PROPOSAL_SUCCESS,
        payload: response
    }
}

export const artisanProposalFailure=(error)=>{
    return{
        type:ARTISAN_PROPOSAL_FAILURE,
        payload: error
    }
}

export const negotiateProposalRequest=()=>{
    return{
        type: NEGOTIATE_PROPOSAL_REQUEST
    }
}
export const negotiateProposalSuccess=(response)=>{
    return{
        type:NEGOTIATE_PROPOSAL_SUCCESS,
        payload: response
    }
}

export const negotiateProposalFailure=(error)=>{
    return{
        type:NEGOTIATE_PROPOSAL_FAILURE,
        payload: error
    }
}

export const negotiateRequest=()=>{
    return{
        type: GET_NEGOTIATION_REQUEST
    }
}
export const negotiateSuccess=(response)=>{
    return{
        type:GET_NEGOTIATION_SUCCESS,
        payload: response
    }
}

export const negotiateFailure=(error)=>{
    return{
        type:GET_NEGOTIATION_FAILURE,
        payload: error
    }
}

// Select Proposal Action Creators
export const selectProposalRequest=()=>{
    return{
        type: SELECT_PROPOSAL_REQUEST
    }
}
export const selectProposalSuccess=(response)=>{
    return{
        type:SELECT_PROPOSAL_SUCCESS,
        payload: response
    }
}
export const selectProposalFailure=(error)=>{
    return{
        type:SELECT_PROPOSAL_FAILURE,
        payload: error
    }
}

// Get Selected Proposals Action Creators
export const getSelectedProposalsRequest=()=>{
    return{
        type: GET_SELECTED_PROPOSALS_REQUEST
    }
}
export const getSelectedProposalsSuccess=(response)=>{
    return{
        type:GET_SELECTED_PROPOSALS_SUCCESS,
        payload: response
    }
}
export const getSelectedProposalsFailure=(error)=>{
    return{
        type:GET_SELECTED_PROPOSALS_FAILURE,
        payload: error
    }
}

// Get Latest Negotiation Action Creators
export const getLatestNegotiationRequest=()=>{
    return{
        type: GET_LATEST_NEGOTIATION_REQUEST
    }
}
export const getLatestNegotiationSuccess=(response)=>{
    return{
        type:GET_LATEST_NEGOTIATION_SUCCESS,
        payload: response
    }
}
export const getLatestNegotiationFailure=(error)=>{
    return{
        type:GET_LATEST_NEGOTIATION_FAILURE,
        payload: error
    }
}

// Accept Negotiation Action Creators
export const acceptNegotiationRequest=()=>{
    return{
        type: ACCEPT_NEGOTIATION_REQUEST
    }
}
export const acceptNegotiationSuccess=(response)=>{
    return{
        type:ACCEPT_NEGOTIATION_SUCCESS,
        payload: response
    }
}
export const acceptNegotiationFailure=(error)=>{
    return{
        type:ACCEPT_NEGOTIATION_FAILURE,
        payload: error
    }
}

// Reject Negotiation Action Creators
export const rejectNegotiationRequest=()=>{
    return{
        type: REJECT_NEGOTIATION_REQUEST
    }
}
export const rejectNegotiationSuccess=(response)=>{
    return{
        type:REJECT_NEGOTIATION_SUCCESS,
        payload: response
    }
}
export const rejectNegotiationFailure=(error)=>{
    return{
        type:REJECT_NEGOTIATION_FAILURE,
        payload: error
    }
}

// API Action Implementations for missing endpoints

// POST /api/Proposal/select/{proposalId}
export const selectProposalAction = (proposalId, history, errors) => {
    return async (dispatch) => {
        dispatch(selectProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const res = await axios.post(`${baseUrl}/select/${proposalId}`, {}, {
                headers: {
                    Authorization: `Bearer ${datas?.token}`
                }
            })
            const {data} = res 
            dispatch(selectProposalSuccess(data))
            if(res.status){
                history()   
            }
        } catch(error) {
            dispatch(selectProposalFailure(error?.response?.data?.message || error.message))
            errors()
        }
    }
}

// GET /api/Proposal/selected/{jobId}
export const getSelectedProposalsAction = (jobId) => {
    return async (dispatch) => {
        dispatch(getSelectedProposalsRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const response = await axios.get(`${baseUrl}/selected/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${datas?.token}`
                }
            })
            const data = response.data;
            dispatch(getSelectedProposalsSuccess(data))
        } catch (error) {
            dispatch(getSelectedProposalsFailure(error?.response?.data?.message || error.message))
        }
    }
}

// GET /api/Proposal/{proposalId}/negotiations/latest
export const getLatestNegotiationAction = (proposalId) => {
    return async (dispatch) => {
        dispatch(getLatestNegotiationRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const response = await axios.get(`${baseUrl}/${proposalId}/negotiations/latest`, {
                headers: {
                    Authorization: `Bearer ${datas?.token}`
                }
            })
            const data = response.data;
            dispatch(getLatestNegotiationSuccess(data))
        } catch (error) {
            dispatch(getLatestNegotiationFailure(error?.response?.data?.message || error.message))
        }
    }
}

// POST /api/Proposal/{negotiationId}/accept
export const acceptNegotiationAction = (negotiationId, history, errors) => {
    return async (dispatch) => {
        dispatch(acceptNegotiationRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const res = await axios.post(`${baseUrl}/${negotiationId}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${datas?.token}`
                }
            })
            const {data} = res 
            dispatch(acceptNegotiationSuccess(data))
            if(res.status){
                history()   
            }
        } catch(error) {
            dispatch(acceptNegotiationFailure(error?.response?.data?.message || error.message))
            errors()
        }
    }
}

// POST /api/Proposal/{negotiationId}/reject
export const rejectNegotiationAction = (negotiationId, history, errors) => {
    return async (dispatch) => {
        dispatch(rejectNegotiationRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const res = await axios.post(`${baseUrl}/${negotiationId}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${datas?.token}`
                }
            })
            const {data} = res 
            dispatch(rejectNegotiationSuccess(data))
            if(res.status){
                history()   
            }
        } catch(error) {
            dispatch(rejectNegotiationFailure(error?.response?.data?.message || error.message))
            errors()
        }
    }
}

// API Action Implementations
export const jobProposalAction = (id) =>{
    return async (dispatch) => {
        dispatch(jobProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const response = await axios.get(`${baseUrl}/joblisting/${id}`,{headers: {
                Authorization: `Bearer ${datas?.token}`
            }})
            const data = response.data;
            dispatch(jobProposalSuccess(data))
        } catch (error) {
            dispatch(jobProposalFailure(error?.response?.data?.message || error.message))
        }
    }
}

export const artisanProposalAction = () =>{
    return async (dispatch) => {
        dispatch(artisanProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const response = await axios.get(`${baseUrl}/Artisan`,{headers: {
                Authorization: `Bearer ${datas?.token}`
            }})
            const data = response.data;
            dispatch(artisanProposalSuccess(data))
        } catch (error) {
            dispatch(artisanProposalFailure(error?.response?.data?.message || error.message))
        }
    }
}

export const negotiateAction = (id) =>{
    return async (dispatch) => {
        dispatch(negotiateRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try {
            const response = await axios.get(`${baseUrl}/${id}/negotiations`,{headers: {
                Authorization: `Bearer ${datas?.token}`
            }})
            const data = response.data;
            dispatch(negotiateSuccess(data))
        } catch (error) {
            dispatch(negotiateFailure(error?.response?.data?.message || error.message))
        }
    }
}

export const postProposalAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(postProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try{
            const res = await axios.post(`${baseUrl}/`, postState,  {headers: {
            Authorization: `Bearer ${datas?.token}`,
           
        }})
            const {data} = res 
            dispatch(postProposalSuccess(data))
            if(res.status){
                history()   
            }
        }
        catch(error){
            dispatch(postProposalFailure(error?.response?.data?.message || error.message))
            errors()
        }
    }
}

export const negotiateProposalAction = (id,postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(negotiateProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try{
            const res = await axios.post(`${baseUrl}/${id}/negotiate`, postState,  {headers: {
            Authorization: `Bearer ${datas?.token}`,
           
        }}) 
            const {data} = res 
            dispatch(negotiateProposalSuccess(data))
            if(res.status){
                history()   
            }
        }
        catch(error){
            dispatch(negotiateProposalFailure(error?.response?.data?.message || error.message))
            errors()
        }
    }
}