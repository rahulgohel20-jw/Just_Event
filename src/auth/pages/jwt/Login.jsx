import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { KeenIcon } from "@/components";
import { ShieldCheck, Zap, Briefcase } from "lucide-react";
import { toAbsoluteUrl } from "@/utils";
import { useAuthContext } from "@/auth";
import { useLayout } from "@/providers";
import { Alert } from "@/components";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  remember: Yup.boolean(),
});

const initialValues = {
  email: "demo@keenthemes.com",
  password: "demo1234",
  remember: false,
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const from = "/auth/2fa";
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!login) {
          throw new Error("JWTProvider is required for this form.");
        }
        await login(values.email, values.password);
        localStorage.setItem("email", values.email);
        navigate(from, { replace: true });
      } catch {
        setStatus("The login details are incorrect");
        setSubmitting(false);
      }
      setLoading(false);
    },
  });

  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="card max-w-[440px] w-full border-0 shadow-none bg-primary-lighest">
      <form
        className="card-body flex flex-col gap-3.5 p-6 md:p-9 bg-white rounded-2xl shadow-[0_2px_20px_rgba(157,30,82,0.08)]"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="mb-1.5">
          <h3 className="text-2xl font-bold text-gray-900 leading-none mb-2.5">
            Welcome Back
          </h3>
          <span className="text-sm text-gray-500">
            Sign in to continue managing your events, clients, venues,
            vendors, and operations seamlessly.
          </span>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <div className="relative">
            <i className="ki-filled ki-sms absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-base pointer-events-none" />
            <input
              placeholder="Email Address"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control w-full !pl-10 !py-3 !rounded-lg !border !border-gray-200 focus:!border-primary focus:!ring-1 focus:!ring-primary-clarity",
                { "is-invalid": formik.touched.email && formik.errors.email }
              )}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <i className="ki-filled ki-lock-2 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-base pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control w-full !pl-10 !pr-10 !py-3 !rounded-lg !border !border-gray-200 focus:!border-primary focus:!ring-1 focus:!ring-primary-clarity",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                }
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-icon btn-sm"
              onClick={togglePassword}
            >
              <KeenIcon
                icon="eye"
                className={clsx("text-gray-400", { hidden: showPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx("text-gray-400", { hidden: !showPassword })}
              />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          <label className="checkbox-group flex items-center gap-1.5">
            <input
              className="checkbox checkbox-sm"
              type="checkbox"
              {...formik.getFieldProps("remember")}
            />
            <span className="text-sm text-gray-600">Remember Me</span>
          </label>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/reset-password"
                : "/auth/classic/reset-password"
            }
            className="text-sm font-medium shrink-0 hover:underline no-underline text-primary hover:text-primary-active"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn flex justify-center grow mt-1 !py-3 !rounded-lg text-primary-inverse bg-primary hover:bg-primary-active !font-semibold !border-0 transition-colors"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>

        <div className="flex items-center gap-2 my-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-400 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        <div className="flex items-center justify-center mt-2">
          <span className="text-sm text-gray-500 me-1.5">
            Don't have an account?
          </span>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/signup"
                : "/auth/classic/signup"
            }
            className="text-sm link hover:underline font-semibold no-underline text-primary hover:text-primary-active"
          >
            Create Account
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

export { Login };