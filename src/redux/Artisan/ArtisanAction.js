import axios from "axios"
import { ALL_ARTISAN_FALIURE, ALL_ARTISAN_REQUEST, ALL_ARTISAN_SUCCESS, ARTISAN_ASSIGNMENT_FALIURE, ARTISAN_ASSIGNMENT_REQUEST, ARTISAN_ASSIGNMENT_SUCCESS, ARTISAN_FALIURE, ARTISAN_REQUEST, ARTISAN_SUCCESS } from "./ArtisanType"


export const allArtisanRequest=()=>{
    return{
        type:ALL_ARTISAN_REQUEST
    }
}
export const allArtisanSuccess=(response)=>{
    return{
        type:ALL_ARTISAN_SUCCESS,
        payload: response
    }
}

export const allArtisanFaliure=(error)=>{
    return{
        type:ALL_ARTISAN_FALIURE,
        payload: error
    }
}

export const artisanRequest=()=>{
    return{
        type:ARTISAN_REQUEST
    }
}
export const artisanSuccess=(response)=>{
    return{
        type:ARTISAN_SUCCESS,
        payload: response
    }
}

export const artisanFaliure=(error)=>{
    return{
        type:ARTISAN_FALIURE,
        payload: error
    }
}

export const artisanAssignmentRequest=()=>{
    return{
        type:ARTISAN_ASSIGNMENT_REQUEST
    }
}
export const artisanAssignmentSuccess=(response)=>{
    return{
        type:ARTISAN_ASSIGNMENT_SUCCESS,
        payload: response
    }
}

export const artisanAssignmentFaliure=(error)=>{
    return{
        type:ARTISAN_ASSIGNMENT_FALIURE,
        payload: error
    }
}

const baseUrl = 'https://distrolink-001-site1.anytempurl.com'


export const getAllArtisanAction = () =>{
    return async (dispatch) => {
        dispatch(allArtisanRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/api/ArtisanDiscovery`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(allArtisanSuccess(data))
        }).catch(error=>{
            dispatch(allArtisanFaliure(error.response.data.message))
        })
    }
}

export const getArtisanIdAction = (id) =>{
    return async (dispatch) => {
        dispatch(artisanRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/api/ArtisanDiscovery/GetArtisanById?id=${id}`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(artisanSuccess(data))
        }).catch(error=>{
            dispatch(artisanFaliure(error.response.data.message))
        })
    }
}

export const postArtisanAssignmentAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(artisanAssignmentRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try{
            const res = await axios.post(`${baseUrl}/api/ArtisanSubcategoryAssignment/assign-multiple`, postState, {headers: {
            Authorization: `Bearer ${datas?.token}`,
        }})
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(artisanAssignmentSuccess(data))
            if(res.status){
                history()   
            }
        }
        catch(error){
            dispatch(artisanAssignmentFaliure(error?.response?.data?.message))
            errors()
        }
    }
}
