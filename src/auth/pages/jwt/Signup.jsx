import clsx from "clsx";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ShieldCheck, Zap, Briefcase, User, Mail, Lock, Building2, LockKeyhole } from "lucide-react";
import { useAuthContext } from "../../useAuthContext";
import { Alert, KeenIcon } from "@/components";
import { useLayout } from "@/providers";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";
import { getstatebycountry, getbycitiesbystate, signup } from "@/services/apiServices";
import SelectField from "@/components/form-inputs/select/SelectField";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

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

const INDIA_COUNTRY_ID = 1;

const signupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "Maximum 50 symbols").required("First name is required"),
  lastName: Yup.string().max(50, "Maximum 50 symbols").required("Last name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  company: Yup.string().max(100, "Maximum 100 symbols"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  password: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

const FormField = ({ icon: Icon, error, touched, children }) => (
  <div className="flex flex-col gap-1">
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-600 pointer-events-none z-10" />
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
    "form-control w-full !pl-10 !py-2.5 !rounded-lg !border !border-gray-200 !text-sm focus:!border-primary focus:!ring-1 focus:!ring-primary-clarity transition-colors",
    { "is-invalid": hasError }
  );

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      try {
        const payload = {
          address: "",
          cityId: Number(values.city),
          clientId: 0,
          companyEmail: values.email,
          companyName: values.company,
          confirmPassword: values.changepassword,
          contactNo: values.mobile,
          countryCode: "+91",
          countryId: INDIA_COUNTRY_ID,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          officeNo: "",
          password: values.password,
          roleId: 1,
          stateId: Number(values.state),
        };

        const res = await signup(payload);

        showApiResult(res, {
          successTitle: "Account created",
          fallbackSuccess: "Your account has been created successfully.",
          errorTitle: "Sign up failed",
          fallbackError: "Something went wrong. Please try again.",
          onSuccess: () => {
            navigate(
              currentLayout?.name === "auth-branded"
                ? "/auth/login"
                : "/auth/classic/login",
              { replace: true }
            );
          },
        });
      } catch (error) {
        showApiError(error, { title: "Sign up failed" });
        setStatus(
          error?.response?.data?.msg || error?.message || "Something went wrong. Please try again."
        );
      } finally {
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

  useEffect(() => {
    let cancelled = false;

    const fetchStates = async () => {
      setStatesLoading(true);
      setLocationError("");
      try {
        const res = await getstatebycountry({
          countryId: INDIA_COUNTRY_ID,
          nameEnglish: "",
          page: 0,
          size: 100,
          sortBy: "id",
          sortDirection: "ASC",
        });
        if (cancelled) return;
        const body = res?.data ?? res;
        setStates(body?.data?.content ?? []);
      } catch {
        if (cancelled) return;
        setStates([]);
        setLocationError("Couldn't load states. Please refresh and try again.");
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    };

    fetchStates();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stateId = formik.values.state;
    if (!stateId) {
      setCities([]);
      return;
    }

    let cancelled = false;

    const fetchCities = async () => {
      setCitiesLoading(true);
      try {
        const res = await getbycitiesbystate({
          stateId,
          nameEnglish: "",
          page: 0,
          size: 100,
          sortBy: "id",
          sortDirection: "ASC",
        });
        if (cancelled) return;
        const body = res?.data ?? res;
        setCities(body?.data?.content ?? []);
      } catch {
        if (cancelled) return;
        setCities([]);
        setLocationError("Couldn't load cities. Please try again.");
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    };

    fetchCities();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.state]);

  return (
    <div className="max-w-[520px] w-full">
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

        {formik.status && (
          <Alert variant="danger" className="text-white">
            {formik.status}
          </Alert>
        )}
        {locationError && (
          <Alert variant="warning">{locationError}</Alert>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField icon={User} error={formik.errors.firstName} touched={formik.touched.firstName}>
            <input
              placeholder="First Name"
              autoComplete="given-name"
              {...formik.getFieldProps("firstName")}
              className={inputClass(formik.touched.firstName && formik.errors.firstName)}
            />
          </FormField>
          <FormField icon={User} error={formik.errors.lastName} touched={formik.touched.lastName}>
            <input
              placeholder="Last Name"
              autoComplete="family-name"
              {...formik.getFieldProps("lastName")}
              className={inputClass(formik.touched.lastName && formik.errors.lastName)}
            />
          </FormField>
        </div>

        <FormField icon={Mail} error={formik.errors.email} touched={formik.touched.email}>
          <input
            placeholder="Email Address"
            type="email"
            autoComplete="email"
            {...formik.getFieldProps("email")}
            className={inputClass(formik.touched.email && formik.errors.email)}
          />
        </FormField>

        <div className="w-full [&_.form-control]:w-full [&_.form-control]:!pl-10 [&_.form-control]:!py-2.5 [&_.form-control]:!rounded-lg [&_.form-control]:!border [&_.form-control]:!border-gray-200 [&_.form-control]:!text-sm [&_.form-control]:focus:!border-primary [&_.form-control]:focus:!ring-1 [&_.form-control]:focus:!ring-primary-clarity">
          <PhoneNumber
            value={formik.values.mobile}
            onChange={(val) => formik.setFieldValue("mobile", val)}
            placeholder="Mobile Number"
          />
        </div>

        <FormField icon={Building2} error={formik.errors.company} touched={formik.touched.company}>
          <input
            placeholder="Company Name"
            autoComplete="organization"
            {...formik.getFieldProps("company")}
            className={inputClass(false)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="State"
            value={formik.values.state}
            onChange={(val) => {
              formik.setFieldValue("state", val);
              formik.setFieldValue("city", "");
            }}
            onBlur={() => formik.setFieldTouched("state", true)}
            error={formik.errors.state}
            touched={formik.touched.state}
            options={states}
            getOptionLabel={(s) => s.nameEnglish}
            getOptionValue={(s) => s.id}
            loading={statesLoading}
            required
          />

          <SelectField
            label="City"
            disabledText="Select state first"
            value={formik.values.city}
            onChange={(val) => formik.setFieldValue("city", val)}
            onBlur={() => formik.setFieldTouched("city", true)}
            error={formik.errors.city}
            touched={formik.touched.city}
            options={cities}
            getOptionLabel={(c) => c.nameEnglish}
            getOptionValue={(c) => c.id}
            loading={citiesLoading}
            disabled={!formik.values.state}
            required
          />
        </div>

        <FormField icon={Lock} error={formik.errors.password} touched={formik.touched.password}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
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

        <FormField
          icon={LockKeyhole}
          error={formik.errors.changepassword}
          touched={formik.touched.changepassword}
        >
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            autoComplete="new-password"
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