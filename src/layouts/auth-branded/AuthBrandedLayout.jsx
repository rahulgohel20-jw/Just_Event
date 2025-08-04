import { Link, Outlet } from "react-router-dom";
import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils";
import useBodyClasses from "@/hooks/useBodyClasses";
import { AuthBrandedLayoutProvider } from "./AuthBrandedLayoutProvider";
const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses("dark:bg-coal-500");
  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl("/images/account_img.jpg")}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl("/images/account_img.jpg")}');
          }
        `}
      </style>
      <div className="grid lg:grid-cols-2 grow">
        <div className="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-2 lg:order-1 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          <div className="flex flex-col p-8 lg:p-16 gap-4 text-center">
            <Link to="/" className="m-auto">
              <img
                src={toAbsoluteUrl("/images/monogram_white.svg")}
                className="h-[42px] max-w-none"
                alt=""
              />
            </Link>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-white">
                Welcome to Just Catering Software
              </h3>
              <div className="text-sm text-white opacity-90">
                It has survived not only five centuries, but also the leap{" "}
                <span className="font-bold">into electronic</span>
                <br className="hidden md:inline" />
                <span className="font-bold">typesetting</span>, remaining essentially unchanged.
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center p-4 md:p-6 lg:p-10 order-1 lg:order-2">
          <Link to="/" className="ms-auto me-auto mt-auto mb-5 lg:hidden">
            <img
              src={toAbsoluteUrl("/images/monogram_white.svg")}
              className="h-[28px] max-w-none"
              alt=""
            />
          </Link>
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};
// AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);
export { AuthBrandedLayout };
