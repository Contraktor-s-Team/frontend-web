import { FaTimesCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
const PasswordChecker = ({ password }) => {
  const checks = [
    {
      label: "Be at least 8 characters",
      isValid: password.length >= 8,
      id: "length"
    },
    {
      label: "Include at least 1 uppercase letter",
      isValid: /[A-Z]/.test(password),
      id: "uppercase"
    },
    {
      label: "Include at least 1 lowercase letter", 
      isValid: /[a-z]/.test(password),
      id: "lowercase"
    },
    {
      label: "Include at least 1 special character",
      isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      id: "special"
    },
    {
      label: "Not contain spaces",
      isValid: !/\s/.test(password),
      id: "spaces"
    }
  ];

  return (
    <div className="mb-[30px] p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center gap-2">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              check.isValid ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {check.isValid ? (
                <IoIosCheckmarkCircle className="w-3 h-3 text-white" />
              ) : (
                <FaTimesCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span className={`text-sm ${
              check.isValid ? 'text-green-700 line-through' : 'text-gray-700'
            }`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordChecker;