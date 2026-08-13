import { useLocation } from 'react-router';
import { SidebarMenuDashboard, SidebarMenuDefault } from '.';

const SidebarSecondary = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col items-stretch grow shrink-0 ps-1.5 my-5 me-1.5 h-full min-h-0 overflow-hidden">
      <div className="grow min-h-0 overflow-y-auto">
        {pathname === '/' ? <SidebarMenuDashboard /> : <SidebarMenuDefault />}
      </div>
    </div>
  );
};

export { SidebarSecondary };