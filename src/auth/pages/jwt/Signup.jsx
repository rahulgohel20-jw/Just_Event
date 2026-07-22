import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ShieldCheck, Zap, Briefcase, User, Mail, Lock, Building2, MapPin, Landmark } from "lucide-react";
import { useAuthContext } from "../../useAuthContext";
import { toAbsoluteUrl } from "@/utils";
import { Alert, KeenIcon } from "@/components";
import { useLayout } from "@/providers";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  company: "",
  state: "",
  city: "",
  password: "",
  changepassword: "",
  acceptTerms: true,
};

const signupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "Maximum 50 symbols").required("First name is required"),
  lastName: Yup.string().max(50, "Maximum 50 symbols").required("Last name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  company: Yup.string().max(100, "Maximum 100 symbols"),
  state: Yup.string().max(50, "Maximum 50 symbols"),
  city: Yup.string().max(50, "Maximum 50 symbols"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required("You must accept the terms and conditions"),
});

// Small reusable field wrapper so every input shares identical spacing,
// icon alignment, and error placement — this is what was making the form
// feel inconsistent before.
const FormField = ({ icon: Icon, error, touched, children }) => (
  <div className="flex flex-col gap-1">
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
      {children}
    </div>
    {touched && error && (
      <span role="alert" className="text-danger text-xs">
        {error}
      </span>
    )}
  </div>
);

const inputClass = (hasError) =>
  clsx(
    "form-control !pl-10 !py-2.5 !rounded-lg !border-gray-200 !text-sm focus:!border-primary focus:!ring-1 focus:!ring-primary-clarity transition-colors",
    { "is-invalid": hasError }
  );

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!register) {
          throw new Error("JWTProvider is required for this form.");
        }
        await register(values.email, values.password, values.changepassword);
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus("The sign up details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword((v) => !v);
  };
  const toggleConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword((v) => !v);
  };

  return (
    <div className="max-w-[480px] w-full">
      <form
        className="flex flex-col gap-3 p-6 md:p-8 bg-white rounded-2xl shadow-[0_2px_24px_rgba(157,30,82,0.09)] border border-gray-100"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-1">
          <h3 className="text-2xl font-bold text-gray-900 leading-none mb-2">
            Create your account
          </h3>
          <span className="text-sm text-gray-500 leading-relaxed">
            Manage every event from planning to execution with one powerful
            platform.
          </span>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        {/* First / Last name */}
        <div className="grid grid-cols-2 gap-3">
          <FormField icon={User} error={formik.errors.firstName} touched={formik.touched.firstName}>
            <input
              placeholder="First Name"
              autoComplete="off"
              {...formik.getFieldProps("firstName")}
              className={inputClass(formik.touched.firstName && formik.errors.firstName)}
            />
          </FormField>
          <FormField icon={User} error={formik.errors.lastName} touched={formik.touched.lastName}>
            <input
              placeholder="Last Name"
              autoComplete="off"
              {...formik.getFieldProps("lastName")}
              className={inputClass(formik.touched.lastName && formik.errors.lastName)}
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField icon={Mail} error={formik.errors.email} touched={formik.touched.email}>
          <input
            placeholder="Email Address"
            type="email"
            autoComplete="off"
            {...formik.getFieldProps("email")}
            className={inputClass(formik.touched.email && formik.errors.email)}
          />
        </FormField>

        {/* Mobile */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 mb-0.5">Phone Number</label>
          <PhoneNumber
            value={formik.values.mobile}
            onChange={(val) => formik.setFieldValue("mobile", val)}
          />
        </div>

        {/* Company */}
        <FormField icon={Building2} error={formik.errors.company} touched={formik.touched.company}>
          <input
            placeholder="Company Name"
            autoComplete="off"
            {...formik.getFieldProps("company")}
            className={inputClass(false)}
          />
        </FormField>

        {/* State / City */}
        <div className="grid grid-cols-2 gap-3">
          <FormField icon={Landmark} error={formik.errors.state} touched={formik.touched.state}>
            <input
              placeholder="State"
              autoComplete="off"
              {...formik.getFieldProps("state")}
              className={inputClass(false)}
            />
          </FormField>
          <FormField icon={MapPin} error={formik.errors.city} touched={formik.touched.city}>
            <input
              placeholder="City"
              autoComplete="off"
              {...formik.getFieldProps("city")}
              className={inputClass(false)}
            />
          </FormField>
        </div>

        {/* Password */}
        <FormField icon={Lock} error={formik.errors.password} touched={formik.touched.password}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="off"
            {...formik.getFieldProps("password")}
            className={clsx(inputClass(formik.touched.password && formik.errors.password), "!pr-10")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={togglePassword}
          >
            <KeenIcon icon="eye" className={clsx({ hidden: showPassword })} />
            <KeenIcon icon="eye-slash" className={clsx({ hidden: !showPassword })} />
          </button>
        </FormField>

        {/* Confirm Password */}
        <FormField
          icon={Lock}
          error={formik.errors.changepassword}
          touched={formik.touched.changepassword}
        >
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            autoComplete="off"
            {...formik.getFieldProps("changepassword")}
            className={clsx(
              inputClass(formik.touched.changepassword && formik.errors.changepassword),
              "!pr-10"
            )}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={toggleConfirmPassword}
          >
            <KeenIcon icon="eye" className={clsx({ hidden: showConfirmPassword })} />
            <KeenIcon icon="eye-slash" className={clsx({ hidden: !showConfirmPassword })} />
          </button>
        </FormField>

        <button
          type="submit"
          className="btn flex justify-center grow mt-1 !py-3 !rounded-lg text-primary-inverse bg-primary hover:bg-primary-active !font-semibold !border-0 transition-colors"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Create Account"}
        </button>

        <div className="flex items-center gap-2 my-1">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-400 font-medium uppercase">Or</span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        {/* Social buttons */}
        

        <div className="flex items-center justify-center mt-2">
          <span className="text-sm text-gray-500 me-1.5">Already have an account?</span>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/login"
                : "/auth/classic/login"
            }
            className="text-sm link hover:underline font-semibold no-underline text-primary hover:text-primary-active"
          >
            Sign In
          </Link>
        </div>
      </form>

      <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="size-3.5 text-primary" />
          Secure Platform
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Zap className="size-3.5 text-primary" />
          Fast Setup
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Briefcase className="size-3.5 text-primary" />
          Enterprise Ready
        </span>
      </div>
    </div>
  );
};

export { Signup };