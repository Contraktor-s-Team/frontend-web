import { combineReducers } from "redux";
import { 
    confirmEmailReducer, 
    registerReducer, 
    validateEmailReducer 
} from "./Auth/Register/RegisterReducer";
import { forgotPasswordReducer, loginReducer, resetPasswordReducer, validateReducer } from "./Auth/Login/LoginReducer";
import { updateUserReducer, userEmailReducer, userReducer } from "./User/UserReducer";
import { hireArtisanSlice } from "./slices/hireArtisanSlice";
import { jobPostSlice } from "./slices/jobPostSlice";
import { categoryReducer, deleteJobReducer, jobidReducer, jobpostReducer, jobReducer, subCategoryReducer } from "./Jobs/JobsReducer";
import { allArtisanReducer, artisanAssignmentReducer, artisanReducer } from "./Artisan/ArtisanReducer";
import { artisanProposalReducer, jobProposalReducer, negotiateProposalReducer, negotiateReducer, proposalPostReducer } from "./Proposals/ProposalReducer";

const rootReducer = combineReducers({
    register: registerReducer,
    validateEmail: validateEmailReducer,
    confirmEmail: confirmEmailReducer,
    login: loginReducer,
    userEmail: userEmailReducer,
    user: userReducer,
    updateUser: updateUserReducer,
    resetPassword: resetPasswordReducer,
    forgotPassword: forgotPasswordReducer,
    reValidate: validateReducer,
    category: categoryReducer,
    subcategory: subCategoryReducer,
    jobs: jobReducer,
    jobpost: jobpostReducer,
    singleJob: jobidReducer,
    artisan: artisanReducer,
    artisanAssignment: artisanAssignmentReducer,
    artisanProposal: artisanProposalReducer,
    proposal: proposalPostReducer,
    jobProposals: jobProposalReducer,
    negotiateProposal: negotiateProposalReducer,
    negotiate:negotiateReducer,
    allArtisan: allArtisanReducer,
    deleteJob: deleteJobReducer,
    hireArtisan: hireArtisanSlice.reducer,
    jobPost: jobPostSlice.reducer
})

export default rootReducer;