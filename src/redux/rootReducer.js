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
    hireArtisan: hireArtisanSlice.reducer,
    jobPost: jobPostSlice.reducer

})

export default rootReducer;