import axios from "axios"
import { CATEGORY_FALIURE, CATEGORY_REQUEST, CATEGORY_SUCCESS, JOB_FALIURE, JOB_ID_FALIURE, JOB_ID_REQUEST, JOB_ID_SUCCESS, JOB_REQUEST, JOB_SUCCESS, POST_JOB_FALIURE, POST_JOB_REQUEST, POST_JOB_SUCCESS, SUBCATEGORY_FALIURE, SUBCATEGORY_REQUEST, SUBCATEGORY_SUCCESS } from "./JobsType"

export const jobRequest=()=>{
    return{
        type:JOB_REQUEST
    }
}
export const jobSuccess=(response)=>{
    return{
        type:JOB_SUCCESS,
        payload: response
    }
}

export const jobFaliure=(error)=>{
    return{
        type:JOB_FALIURE,
        payload: error
    }
}

export const postJobRequest=()=>{
    return{
        type:POST_JOB_REQUEST
    }
}
export const postJobSuccess=(response)=>{
    return{
        type:POST_JOB_SUCCESS,
        payload: response
    }
}

export const postJobFaliure=(error)=>{
    return{
        type:POST_JOB_FALIURE,
        payload: error
    }
}
export const jobIdRequest=()=>{
    return{
        type:JOB_ID_REQUEST
    }
}
export const jobIdSuccess=(response)=>{
    return{
        type:JOB_ID_SUCCESS,
        payload: response
    }
}

export const jobIdFaliure=(error)=>{
    return{
        type:JOB_ID_FALIURE,
        payload: error
    }
}

export const categoryRequest=()=>{
    return{
        type:CATEGORY_REQUEST
    }
}
export const categorySuccess=(response)=>{
    return{
        type:CATEGORY_SUCCESS,
        payload: response
    }
}

export const categoryFaliure=(error)=>{
    return{
        type:CATEGORY_FALIURE,
        payload: error
    }
}

export const subcategoryRequest=()=>{
    return{
        type:SUBCATEGORY_REQUEST
    }
}
export const subcategorySuccess=(response)=>{
    return{
        type:SUBCATEGORY_SUCCESS,
        payload: response
    }
}

export const subcategoryFaliure=(error)=>{
    return{
        type:SUBCATEGORY_FALIURE,
        payload: error
    }
}
const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Job'
export const jobAction = () =>{
    return async (dispatch) => {
        dispatch(jobRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/customer`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(jobSuccess(data))
        }).catch(error=>{
            dispatch(jobFaliure(error.response.data.message))
        })
    }
}


export const jobIdAction = (id) =>{
    return async (dispatch) => {
        dispatch(jobIdRequest())
        await axios.get(`${baseUrl}/${id}`)
        .then(response=>{
            const data = response.data;
            dispatch(jobIdSuccess(data))
        }).catch(error=>{
            dispatch(jobIdFaliure(error.response.data.message))
        })
    }
}

export const postJobAction = (postState, history, errors) =>{
    return async (dispatch) => {
        dispatch(postJobRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        try{
            const res = await axios.post(`${baseUrl}/`, postState,  {headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
            const {data} = res 
            console.log(data)
            console.log(res)
            dispatch(postJobSuccess(data))
            if(res.status){
                history()
                
            }
        }
        catch(error){
            dispatch(postJobFaliure(error.response.data.message))
            errors()
        }
    }
}


export const categoryAction = () =>{
    return (dispatch) => {
        console.log("categoryAction called")
        dispatch(categoryRequest())
        axios.get(`https://distrolink-001-site1.anytempurl.com/api/ArtisanCategory`)
            .then(response=>{
                const data = response.data;
                console.log("category data", data)
                dispatch(categorySuccess(data))
            }).catch(error=>{
                dispatch(categoryFaliure(error.response.data.message))
            })
    }
}


export const subCategoryAction = (id) =>{
    return  (dispatch) => {

        dispatch(subcategoryRequest())
        axios.get(`https://distrolink-001-site1.anytempurl.com/api/ArtisanSubcategory/category/${id}`)
            .then(response=>{
                const data = response.data;
                dispatch(subcategorySuccess(data))
            }).catch(error=>{
                dispatch(subcategoryFaliure(error.response.data.message))
            })
    }
}