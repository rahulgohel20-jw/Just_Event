import { SidebarMenu } from './';

const SidebarContent = () => {
  return (
    <div className="sidebar-content flex grow min-h-0 py-5 pe-2">
      <div className="scrollable-y-hover grow min-h-0 overflow-y-auto flex ps-2 lg:ps-5 pe-1 lg:pe-3">
        <SidebarMenu />
      </div>
    </div>
  );
};

export { SidebarContent };