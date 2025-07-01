import { TailSpin } from "react-loader-spinner";
const LoaderComp = () => {
    return (
        <TailSpin
            height="20"
            width="20"
            color="#0091F0"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    );
};  
export default LoaderComp;