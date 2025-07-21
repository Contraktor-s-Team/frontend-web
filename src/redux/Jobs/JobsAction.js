import { JOB_FALIURE, JOB_ID_FALIURE, JOB_ID_REQUEST, JOB_ID_SUCCESS, JOB_REQUEST, JOB_SUCCESS, POST_JOB_FALIURE, POST_JOB_REQUEST, POST_JOB_SUCCESS } from "./JobsType"

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

const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Job'
export const jobAction = () =>{
    return async (dispatch) => {
        dispatch(jobRequest())
        await axios.get(`${baseUrl}/`)
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
        try{
            const res = await axios.post(`${baseUrl}/`, postState)
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