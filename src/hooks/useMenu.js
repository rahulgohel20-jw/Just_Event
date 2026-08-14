import { applyMenuRights } from "@/utils/applyMenuRights";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthContext } from "@/auth";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  MENU_SIDEBAR,
  superAdminMenuItems,
} from "../config/menu.config";

// Modules shown in HeaderTopbar when isVisible=true — hidden from sidebar
const HEADER_OWNED_TITLES = [
  "Master",
  "Banquet",
  "Vendor",
  "Menu Item",
  "Raw Material",
  "Stock",
  "Account",
];

const GATED_MODULES = [
  "Account", "Stock", "CRM", "AI Menu", "Menu Share Link", "Banquet",
  "Captain Recipe", "Assign Manager", "Food Taste Festival", "Event Flow",
  "Decor", "Menu Extra Features", "kyc",
];

const HIDDEN_WHEN_NOT_VISIBLE = [
  "Dashboard", "Report", "Custom Themes", "Configuration",
  "Account", "Stock", "CRM", "Banquet", "Sales",
];

const getActiveModuleNames = (upgradedModules, currentUser) => {
  const modules =
    upgradedModules?.length > 0
      ? upgradedModules
      : currentUser?.userUpgradedModule || [];

  return modules
    .filter((m) => m.isActive && m.isPayDone)
    .map((m) => m.moduleName);
};

const applyUpgradedModules = (menuItems, activeModuleNames) => {
  return menuItems.filter((item) => {
    if (!item.moduleName) return true;
    if (!GATED_MODULES.includes(item.moduleName)) return true;
    return activeModuleNames.includes(item.moduleName);
  });
};

const applyVisibilityFilter = (menuItems, isVisible) => {
  if (isVisible !== false) return menuItems;
  return menuItems.filter((item) => {
    const pageName = item.pageName || "";
    const moduleName = item.moduleName || "";
    const titleStr = typeof item.title === "string" ? item.title : "";
    return !HIDDEN_WHEN_NOT_VISIBLE.some(
      (hidden) => pageName === hidden || moduleName === hidden || titleStr === hidden
    );
  });
};

const applyHeaderOwned = (menuItems, isHeaderOwned) => {
  if (!isHeaderOwned) return menuItems; // not a header-owned brand → keep everything in sidebar
  return menuItems.filter((item) => {
    const pageName = item.pageName || "";
    const moduleName = item.moduleName || "";
    return !HEADER_OWNED_TITLES.some((t) => pageName === t || moduleName === t);
  });
};

export const useMenu = () => {
  const { currentUser, loading } = useAuthContext();
  const rights = useAuthStore((state) => state.rights);
  const upgradedModules = useAuthStore((state) => state.upgradedModules);
  const location = useLocation();
  const navigate = useNavigate();

  const menu = useMemo(() => {
    if (!currentUser) {
      return MENU_SIDEBAR;
    }

    const roleId = Number(currentUser?.userBasicDetails?.role?.id);
    const clientId = currentUser?.clientId;
    const plan = currentUser?.plan;
    const isApproved = currentUser?.isApprove === true;
    const isSuperSystem = roleId === 1 || clientId === 1;
    const isVisible = currentUser?.isVisible ?? true;

    const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const isHeaderOwned = ["jcxpro", "justbanq"].includes(authStorage?.state?.user?.softType);

    let baseMenu = isSuperSystem ? superAdminMenuItems : MENU_SIDEBAR;
    console.log("superAdminMenuItems:", superAdminMenuItems);

    if (!plan || !isApproved) {
      return baseMenu;
    }

    const activeModuleNames = getActiveModuleNames(upgradedModules, currentUser);

    if (roleId >= 2) {
      baseMenu = applyUpgradedModules(baseMenu, activeModuleNames);
    }

    baseMenu = applyVisibilityFilter(baseMenu, isVisible);
    baseMenu = applyHeaderOwned(baseMenu, isHeaderOwned);

    if (roleId === 1 || roleId === 2) {
      return baseMenu;
    }

    return applyMenuRights(baseMenu, rights, activeModuleNames);
   }, [currentUser, rights, upgradedModules, location.pathname]);

  return { menu: Array.isArray(menu) ? menu : [], loading };
};