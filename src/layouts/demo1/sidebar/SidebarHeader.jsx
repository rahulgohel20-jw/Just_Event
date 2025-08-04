import React, { forwardRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDemo1Layout } from '../';
import { toAbsoluteUrl } from '@/utils';
import { SidebarToggle } from './';
const SidebarHeader = forwardRef((props, ref) => {
  const {
    layout
  } = useDemo1Layout();
  const lightLogo = () => <Fragment>
      <Link to="/" className="dark:hidden">
        <img src={toAbsoluteUrl('/images/logo.svg')} className="default-logo h-[40px] max-w-none transition-all" />
        <img src={toAbsoluteUrl('/images/monogram.svg')} className="small-logo h-[36px] max-w-none transition-all" />
      </Link>
      <Link to="/" className="hidden dark:block">
        <img src={toAbsoluteUrl('/images/logo_white.svg')} className="default-logo h-[40px] max-w-none transition-all" />
        <img src={toAbsoluteUrl('/images/monogram_white.svg')} className="small-logo h-[36px] max-w-none transition-all" />
      </Link>
    </Fragment>;
  const darkLogo = () => <Link to="/">
      <img src={toAbsoluteUrl('/images/logo_white.svg')} className="default-logo h-[40px] max-w-none transition-all" />
      <img src={toAbsoluteUrl('/images/monogram_white.svg')} className="small-logo h-[36px] max-w-none transition-all" />
    </Link>;
  return <div ref={ref} className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0 transition-all">
      {layout.options.sidebar.theme === 'light' ? lightLogo() : darkLogo()}
      <SidebarToggle />
    </div>;
});
export { SidebarHeader };