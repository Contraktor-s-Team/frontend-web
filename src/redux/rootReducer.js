import { combineReducers } from "redux";
import { 
    confirmEmailReducer, 
    registerReducer, 
    validateEmailReducer 
} from "./Auth/Register/RegisterReducer";
import { forgotPasswordReducer, loginReducer, resetPasswordReducer, validateReducer } from "./Auth/Login/LoginReducer";
import { userEmailReducer, userReducer } from "./User/UserReducer";

const rootReducer = combineReducers({
    register: registerReducer,
    validateEmail: validateEmailReducer,
    confirmEmail: confirmEmailReducer,
    login: loginReducer,
    userEmail: userEmailReducer,
    user: userReducer,
    resetPassword: resetPasswordReducer,
    forgotPassword: forgotPasswordReducer,
    reValidate: validateReducer
})

export default rootReducer;