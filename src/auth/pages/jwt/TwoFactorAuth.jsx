import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { KeenIcon } from "@/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthContext } from "../../useAuthContext";
const TwoFactorAuth = () => {
  const {
    login
  } = useAuthContext();
  const navigate = useNavigate();
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const handleInputChange = (index, value) => {
    if (value.length > 1 || isNaN(value)) return;
    const updatedInputs = [...codeInputs];
    updatedInputs[index] = value;
    setCodeInputs(updatedInputs);

    const otp = updatedInputs.join("");
    formik.setFieldValue("otp", otp); // <-- Add this line
    // Automatically focus the next input
    if (value && index < codeInputs.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeInputs[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object().shape({
      otp: Yup.string()
        .length(6, "OTP must be exactly 6 digits")
        .required("OTP is required"),
    }),
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        const otp = codeInputs.join("");
        if (otp.length !== 6) {
          throw new Error("Please enter a valid 6-digit OTP.");
        }
        await login('demo@keenthemes.com', 'demo1234');
        // Simulate API call or validation
        navigate('/', {
          replace: true,
        });
        // Navigate or handle success
      } catch (error) {
        setStatus(error.message);
        setSubmitting(false);
      }
      setLoading(false);
    },
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex items-start flex-col gap-2 p-7"
        onSubmit={formik.handleSubmit}
      >
        <img
          src={toAbsoluteUrl("/media/illustrations/34.svg")}
          className="dark:hidden h-12 mb-2"
          alt=""
        />
        <img
          src={toAbsoluteUrl("/media/illustrations/34-dark.svg")}
          className="light:hidden h-12 mb-2"
          alt=""
        />
        <div className="mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2">OTP Verification</h3>
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">Please enter the one time password to verify your account.</span>
            <span className="text-sm text-gray-700 mt-2">
              A code has been sent to
               <span className="ms-1">
                {localStorage.getItem("phone")
                  ? localStorage.getItem("phone")
                  : localStorage.getItem("email")}
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {codeInputs.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              className="input text-base text-gray-900 focus:border-primary-clarity focus:ring focus:ring-primary-clarity size-10 shrink-0 px-0 text-center"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
          {formik.touched.otp && formik.errors.otp && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.otp}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center text-center w-full mt-2">
          <span className="text-sm text-gray-700 me-1.5">
            Didn't receive a code? (37s)
          </span>
          <Link to={localStorage.getItem("phone") ? "/auth/otp-login" : "/auth/login"} className="text-sm link hover:underline no-underline">
            Resend OTP
          </Link>
        </div>
        <button
          type="submit"
          className="btn btn-primary flex justify-center grow mt-3 w-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Verify & Proceed"}
        </button>
        <div className="text-center w-full">
          <Link
            to={localStorage.getItem("phone") ? "/auth/otp-login" : "/auth/login"}
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary mt-2"
          >
            <KeenIcon icon="black-left" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};
export { TwoFactorAuth };
