import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils";
import useBodyClasses from "@/hooks/useBodyClasses";
import { AuthBrandedLayoutProvider } from "./AuthBrandedLayoutProvider";

// Map each auth route to its own illustration + copy
const PAGE_CONTENT = {
  login: {
    image: "/images/login_img.jpg",
    alt: "Illustration of an event planner coordinating venues, vendors, and logistics",
    title: "Just Event",
    description:
      "The trusted command center for global event professionals. From high-stakes corporate summits to intimate luxury celebrations, manage every detail with absolute precision and ease.",
  },
  signup: {
    image: "/images/signup.jpg",
    alt: "Illustration of an event planner setting up a venue with decor and lighting",
    title: "Just Event",
    description:
      "The premier enterprise-grade platform for professional event planners. From luxury weddings to high-scale corporate conferences, manage every detail with precision, elegance, and ease.",
  },
};

const getPageKey = (pathname) => {
  if (pathname.includes("signup")) return "signup";
  return "login"; // default/fallback (login, reset-password, 2fa, etc.)
};

const Layout = () => {
  useBodyClasses("dark:bg-coal-500");
  const location = useLocation();
  const content = PAGE_CONTENT[getPageKey(location.pathname)];

  return (
    <Fragment>
      <div className="grid lg:grid-cols-2 grow min-h-screen bg-white">
        {/* Illustration side */}
        <div className="hidden lg:flex flex-col items-center justify-center order-1 p-10 bg-white">
          <div className="max-w-[400px] w-full flex flex-col items-center text-center gap-6">
            <img
              src={toAbsoluteUrl(content.image)}
              alt={content.alt}
              className="w-full max-w-[500px] h-auto"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-primary">{content.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex justify-center flex-col items-center p-4 md:p-6 lg:p-10 order-2 bg-primary-inverse">
          <Link to="/" className="ms-auto me-auto mt-auto mb-5 lg:hidden">
            <span className="text-xl font-bold text-primary">Just Event</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };