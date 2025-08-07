import axios from "axios"
import { ARTISAN_PROPOSAL_FALIURE, ARTISAN_PROPOSAL_REQUEST, ARTISAN_PROPOSAL_SUCCESS, GET_NEGOTIATION_FALIURE, GET_NEGOTIATION_REQUEST, GET_NEGOTIATION_SUCCESS, JOB_PROPOSAL_FALIURE, JOB_PROPOSAL_REQUEST, JOB_PROPOSAL_SUCCESS, NEGOTIATE_PROPOSAL_FALIURE, NEGOTIATE_PROPOSAL_REQUEST, NEGOTIATE_PROPOSAL_SUCCESS, POST_PROPOSAL_FALIURE, POST_PROPOSAL_REQUEST, POST_PROPOSAL_SUCCESS } from "./ProposalType"

// export const jobRequest=()=>{
//     return{
//         type:JOB_REQUEST
//     }
// }
// export const jobSuccess=(response)=>{
//     return{
//         type:JOB_SUCCESS,
//         payload: response
//     }
// }

// export const jobFaliure=(error)=>{
//     return{
//         type:JOB_FALIURE,
//         payload: error
//     }
// }

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

export const postProposalFaliure=(error)=>{
    return{
        type:POST_PROPOSAL_FALIURE,
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
export const jobProposalFaliure=(error)=>{
    return{
        type:JOB_PROPOSAL_FALIURE,
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

export const artisanProposalFaliure=(error)=>{
    return{
        type:ARTISAN_PROPOSAL_FALIURE,
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

export const negotiateProposalFaliure=(error)=>{
    return{
        type:NEGOTIATE_PROPOSAL_FALIURE,
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

export const negotiateFaliure=(error)=>{
    return{
        type:GET_NEGOTIATION_FALIURE,
        payload: error
    }
}

// export const categoryRequest=()=>{
//     return{
//         type:CATEGORY_REQUEST
//     }
// }
// export const categorySuccess=(response)=>{
//     return{
//         type:CATEGORY_SUCCESS,
//         payload: response
//     }
// }

// export const categoryFaliure=(error)=>{
//     return{
//         type:CATEGORY_FALIURE,
//         payload: error
//     }
// }

// export const subcategoryRequest=()=>{
//     return{
//         type:SUBCATEGORY_REQUEST
//     }
// }
// export const subcategorySuccess=(response)=>{
//     return{
//         type:SUBCATEGORY_SUCCESS,
//         payload: response
//     }
// }

// export const subcategoryFaliure=(error)=>{
//     return{
//         type:SUBCATEGORY_FALIURE,
//         payload: error
//     }
// }
const baseUrl = 'https://distrolink-001-site1.anytempurl.com/api/Proposal'
// export const jobAction = () =>{
//     return async (dispatch) => {
//         dispatch(jobRequest())
//         let datas = JSON.parse(localStorage.getItem("auth"))
//         await axios.get(`${baseUrl}/customer`,{headers: {
//             Authorization: `Bearer ${datas?.token}`
//         }})
//         .then(response=>{
//             const data = response.data;
//             dispatch(jobSuccess(data))
//         }).catch(error=>{
//             dispatch(jobFaliure(error.response.data.message))
//         })
//     }
// }


export const jobProposalAction = (id) =>{
    return async (dispatch) => {
        dispatch(jobProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/joblisting/${id}`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(jobProposalSuccess(data))
        }).catch(error=>{
            dispatch(jobProposalFaliure(error.response.data.message))
        })
    }
}

export const artisanProposalAction = () =>{
    return async (dispatch) => {
        dispatch(artisanProposalRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/Artisan`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(artisanProposalSuccess(data))
        }).catch(error=>{
            dispatch(artisanProposalFaliure(error.response.data.message))
        })
    }
}

export const negotiateAction = (id) =>{
    return async (dispatch) => {
        dispatch(negotiateRequest())
        let datas = JSON.parse(localStorage.getItem("auth"))
        await axios.get(`${baseUrl}/${id}/negotiations`,{headers: {
            Authorization: `Bearer ${datas?.token}`
        }})
        .then(response=>{
            const data = response.data;
            dispatch(negotiateSuccess(data))
        }).catch(error=>{
            dispatch(negotiateFaliure(error.response.data.message))
        })
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
            console.log(data)
            console.log(res)
            dispatch(postProposalSuccess(data))
            if(res.status){
                history()   
            }
        }
        catch(error){
            dispatch(postProposalFaliure(error?.response?.data?.message))
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
            console.log(data)
            console.log(res)
            dispatch(negotiateProposalSuccess(data))
            if(res.status){
                history()   
            }
        }
        catch(error){
            dispatch(negotiateProposalFaliure(error?.response?.data?.message))
            errors()
        }
    }
}

// export const categoryAction = () =>{
//     return (dispatch) => {
//         console.log("categoryAction called")
//         dispatch(categoryRequest())
//         axios.get(`https://distrolink-001-site1.anytempurl.com/api/ArtisanCategory`)
//             .then(response=>{
//                 const data = response.data;
//                 console.log("category data", data)
//                 dispatch(categorySuccess(data))
//             }).catch(error=>{
//                 dispatch(categoryFaliure(error.response.data.message))
//             })
//     }
// }


// export const subCategoryAction = (id) =>{
//     return  (dispatch) => {

//         dispatch(subcategoryRequest())
//         axios.get(`https://distrolink-001-site1.anytempurl.com/api/ArtisanSubcategory/category/${id}`)
//             .then(response=>{
//                 const data = response.data;
//                 dispatch(subcategorySuccess(data))
//             }).catch(error=>{
//                 dispatch(subcategoryFaliure(error.response.data.message))
//             })
//     }
// }

// export const artisanJobAction = (Id) =>{
//     return async (dispatch) => {
//         dispatch(jobRequest())
//         let datas = JSON.parse(localStorage.getItem("auth"))
//         await axios.get(`${baseUrl}/subcategory/${Id}`,{headers: {
//             Authorization: `Bearer ${datas?.token}`
//         }})
//         .then(response=>{
//             const data = response.data;
//             dispatch(jobSuccess(data))
//         }).catch(error=>{
//             dispatch(jobFaliure(error.response.data.message))
//         })
//     }
// }
