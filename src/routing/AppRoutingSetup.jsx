import { Navigate, Route, Routes } from "react-router";
import { Demo1DarkSidebarPage } from "@/pages/dashboards";
import {
  ProfileActivityPage,
  ProfileBloggerPage,
  CampaignsCardPage,
  CampaignsListPage,
  ProjectColumn2Page,
  ProjectColumn3Page,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage,
} from "@/pages/public-profile";
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage,
} from "@/pages/account";
import {
  NetworkAppRosterPage,
  NetworkMarketAuthorsPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSocialPage,
  NetworkUserCardsTeamCrewPage,
  NetworkSaasUsersPage,
  NetworkStoreClientsPage,
  NetworkUserTableTeamCrewPage,
  NetworkVisitorsPage,
} from "@/pages/network";
import { AuthPage } from "@/auth";
import { RequireAuth } from "@/auth/RequireAuth";
import { Demo1Layout } from "@/layouts/demo1";
import { ErrorsRouting } from "@/errors";
import {
  AuthenticationWelcomeMessagePage,
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage,
} from "@/pages/authentication";
import { LeadPage, LeadDetailPage, OverviewPage } from "@/pages/lead";
import { ProductListDetail, ProductListPage } from "@/pages/product";
import { ContactDetail, ContactListPage } from "@/pages/contact";
import { LinkList } from "@/pages/link";
import { CompanyListPage, CompanyDetails } from "@/pages/company";
import { SalesTeamList, UserRoleList, MemberList } from "@/pages/team";
import {
  NotificationsSettingsPage,
  GeneralSettingsPage,
  CustomizeSettingsPage,
  ChannelSettingsPage,
} from "@/pages/setting";
import { BillingOverviewPage, WalletLogsPage } from "@/pages/billing";
import {
  ApplicationPage,
  TicketsPage,
  TutorialsPage,
  EventsPage,
  RaiseTicketPage,
  ProgressChecklistPage,
} from "@/pages/support";
import { FollowUpListPage } from "@/pages/follow-up";
import { Dashboard } from "@/pages/dashboard";
import GuestDashboard from "../pages/Guest/GuestDashboard/GuestDashboard";
import {
  TaskListPage,
  TaskTemplatePage,
  TaskDirectoryPage,
} from "@/pages/tasks";

import { Holiday } from "@/pages/Leave/holiday";
import { MyLeaves } from "@/pages/Leave/my-leaves";
import { Approval } from "@/pages/Leave/approval";
import { Myattendance } from "@/pages/Leave/my-attendance/Myattendance";
import Allleave from "@/pages/Leave/all-leave/Allleave";
import { AllAttendance } from "@/pages/Leave/all-attendance";
import { LeaveType } from "@/pages/Leave/settings/leave-type/LeaveType";

import { AttendanceSetting } from "@/pages/Leave/settings/attendance-settings/AttendanceSettings";
import { OfficeSetting } from "@/pages/Leave/settings/offices-settings/OfficeSettings";

import Leavedashboard from "@/pages/Leave/dashboard/Leavedashboard";
import CalendarPage from "@/pages/Event/CalendarPage";
import CreateEventPage from "@/pages/Event/CreateEventPage";
import EventListPage from "@/pages/Event/EventListPage";
import EventPreparationPage from "@/pages/Event/EventPreparationPage";
import EventMenuAllocationPage from "@/pages/Event/EventMenuAllocationPage";
import RawMaterialAllocationPage from "@/pages/Event/RawMaterialAllocationPage";
import LabourOtherManagementPage from "@/pages/Event/LabourOtherManagementPage";
import OrderBookingReportsPage from "@/pages/Event/OrderBookingReportsPage";
import DishCostingPage from "@/pages/Event/DishCostingPage";
import EventInvoicePage from "@/pages/Event/EventInvoicePage";
import AddInvoicePage from "@/pages/Event/AddInvoicePage";
import InvoiceViewPage from "@/pages/Event/InvoiceViewPage";
import ProformaInvoicePage from "@/pages/Event/ProformaInvoicePage";
import GuestForm from "@/pages/Guest/GuestForm/GuestForm";
import { EventOverviewPage } from "@/pages/Event/EventOverViewPage";
import InventoryDashboard from "../pages/inventory/InventoryDashboard/InventoryDashboard";
import RawCategoryType from "../pages/inventory/RawCategoryType/RawCategoryType";
import CategoryMaster from "../pages/Master/Category Master";
import ClientMaster from "../pages/Master/ClientMaster";
import VendorMaster from "../pages/Master/VendorMaster";
import TaxMaster from "../pages/Master/TaxMaster";
import FunctionMaster from "../pages/Master/FunctionMaster";
import VenueMaster from "../pages/Master/VenueMaster";
import AddVenuePage from "../pages/Master/VenueMaster/AddVenuePage";
import CreateEventName from "../pages/Event/CreateEventPage/Createeventname";
import CreateEvent from "../pages/Event/CreateEventPage";
import CategoryTypeMaster from "../pages/Master/CategoryTypeMaster";
import RowCategoryTypeMaster from "../pages/Master/RowCategoryTypeMaster";
import RowCategoryMaster from "../pages/Master/RowCategoryMaster";
import UnitMaster from "../pages/Master/UnitMaster";
import RowItemMaster from "../pages/Master/RowItemMaster";
import RawSubCategoryMaster from "../pages/Master/RowSubCategoryMaster";
import RoleMaster from "../pages/Master/RoleMaster";
import ExecutionPage from "../pages/execution/ExecutionPage";
import PlanMaster from "../pages/Master/Plan Master";
import EventTypeMaster from "../pages/Master/EventTypeMaster";
import EventFlower from "../pages/Event/EventFlower/EventFlower";
import ReportKeyMaster from "../pages/Master/Theme_Template_Master/Report_configuration";
import TemplateNameMaster from "../pages/Master/Theme_Template_Master/TemplateMaster";
import { TemplateTypePage } from "../pages/Master/Theme_Template_Master/Theme_Type_Master";
import EventLighting from "../pages/Event/EventLightning/EventLighting";
import EventLED from "../pages/Event/EventLed/EventLED";
import EventSound from "../pages/Event/EventSound/EventSound";
import EventMandap from "../pages/Event/EventMandap/EventMandap";
import EventFurniture from "../pages/Event/EventFurniture/EventFurniture";
import ArtistsManagement from "../pages/Event/ArtistsManagement/ArtistsManagement";
import EventPrinting from "../pages/Event/EventPrinting/EventPrinting";
import EventOutsourceAgency from "../pages/Event/EventOutsourceAgency/EventOutsourceAgency";
import EventNewMaking from "../pages/Event/EventNewMaking/EventNewMaking";
import EventGodown from "../pages/Event/EventGodown/EventGodown";
import EventLabourAgency from "../pages/Event/EventLabourAgency/EventLabourAgency";
import { CashaccountPage } from "../pages/Master/CashAccount";
import { BankDetailsMasterPage } from "../pages/Master/BankAccount";
import { Menuitemcattypemaster } from "../pages/Master/MenuItemMaster/MenuItemCategoryType";
import { MenuItemCategoryMaster } from "../pages/Master/MenuItemMaster/Menuitemcategory";
import { MenuItemMaster } from "../pages/Master/MenuItemMaster/menuitemmaster";
import QuotationPage from "../pages/quotation";
import { UserReportKeyPage } from "../pages/setting/UserReportKey/UserReportKeyPage";
import TripMaster from "../pages/Master/TripMaster/TripMaster";
import TransportationMaster from "../pages/Master/TransportationMaster/TransportationMaster";
import EventTransportation from "../pages/Event/EventTransportation/EventTransportation";
import { MenuReportThemesPage } from "../pages/Master/Theme_Template_Master/All_Theme";
import UserMaster from "../pages/Master/user_master";
const AppRoutingSetup = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route>

          <Route element={<Demo1Layout />}>
            {/* project routs */} 
            <Route path="/allmember" element={<UserMaster/>}/>
            <Route path="/alltheme" element={<MenuReportThemesPage/>}/>
            <Route path="/userwisereportkey" element={<UserReportKeyPage/>}/>
            <Route path="/menuitemmaster" element={<MenuItemMaster/>}/>
            <Route path="/menucatmaster" element={<MenuItemCategoryMaster/>}/>
         <Route path="/menucattypemaster" element={<Menuitemcattypemaster/>}/>
            <Route path="/bankaccount" element={<BankDetailsMasterPage/>}/>
            <Route path="/cashaccount" element={<CashaccountPage/>}/>
            <Route path="/templatetypemaster" element={<TemplateTypePage/>}/>
            <Route path="/templatenamemaster" element={<TemplateNameMaster/>}/>
            <Route path="/reporkeymaster" element={<ReportKeyMaster/>}/>
            <Route path="/planmaster" element={<PlanMaster/>}/>
            <Route path="/eventtypemaster" element={<EventTypeMaster/>}/>
          <Route path="/master/categorytypemaster" element={<CategoryTypeMaster />} />
            <Route path="/creteEvent" element={<CreateEvent />} />
            <Route path="/creteevnetname" element={<CreateEventName />} />
            <Route path="/master/venuemaster/add" element={<AddVenuePage />} />
            <Route path="/master/venuemaster" element={<VenueMaster />} />
            <Route path="/master/functionmaster" element={<FunctionMaster />} />
            <Route path="/master/taxmaster" element={<TaxMaster />} />
            <Route path="/master/vendormaster" element={<VendorMaster />} />
            <Route path="/master/clientmaster" element={<ClientMaster />} />
            <Route path="/master/categorymaster" element={<CategoryMaster />} />
            <Route path="/master/rowcategorytypemaster" element={<RowCategoryTypeMaster />} />
            <Route path="/master/rowcategorymaster" element={<RowCategoryMaster />} />
            <Route path="/master/unitmaster" element={<UnitMaster />} />
            <Route path="/master/rowitemmaster" element={<RowItemMaster />} />
            <Route path="/master/rowsubcategorymaster" element={<RawSubCategoryMaster />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts/details" element={<ContactDetail />} />
            <Route path="/contacts" element={<ContactListPage />} />
            <Route path="/lead" element={<LeadPage />} />
            <Route path="/lead/details" element={<LeadDetailPage />} />
            <Route path="/overview" element={<OverviewPage />} />

          {/* Quotation */}
          <Route path="/quotation/:eventId" element={<QuotationPage />} />
          <Route path="/execution/:eventId" element={<ExecutionPage />}/>
          <Route path="/flower" element={<EventFlower />}/>
          <Route path="/lighting" element={<EventLighting />}/>
          <Route path="/ledwall" element={<EventLED />}/>
          <Route path="/sound" element={<EventSound />}/>
          <Route path="/mandap" element={<EventMandap />}/>
          <Route path="/furniture" element={<EventFurniture />}/>
          <Route path="/artist-entertainment" element={<ArtistsManagement />}/>
          <Route path="/printing" element={<EventPrinting />}/>
           <Route path="/outsource-agency" element={<EventOutsourceAgency />}/>
           <Route path="/new-making" element={<EventNewMaking />}/>
           <Route path="/godown" element={<EventGodown />}/>
              <Route path="/labour-agency" element={<EventLabourAgency />}/>
              <Route path="/transportation" element={<EventTransportation />}/>

            <Route path="/tripmaster" element={<TripMaster />}/>
            <Route path="/transportationmaster" element={<TransportationMaster />}/>
            <Route path="/rolemaster" element={<RoleMaster />} />

            <Route path="/company" element={<CompanyListPage />}></Route>
            <Route path="/companydetails" element={<CompanyDetails />}></Route>
            <Route path="/followup" element={<FollowUpListPage />}></Route>

            {/* guest routes */}
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            <Route path="/guest-form" element={<GuestForm />} />


            {/* Inventory routes */}
            <Route path="/inventory-dashboard" element={<InventoryDashboard />} />

            <Route path="/inventory-category-type" element={<RawCategoryType />} />

            {/* Theme routes */}
            <Route path="/company" element={<CompanyListPage />}></Route>
            <Route path="/companydetail" element={<CompanyDetails />}></Route>
            <Route path="/links" element={<LinkList />}></Route>
            <Route path="/product" element={<ProductListPage />}></Route>
            <Route path="/product/detail" element={<ProductListDetail />}></Route>
            <Route path="/team/seals-team" element={<SalesTeamList />} />
            <Route path="/team/user-role" element={<UserRoleList />} />
            <Route path="/team/all-members" element={<MemberList />} />

            {/* event management routes */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/event" element={<EventListPage />} />
            <Route path="/event-overview" element={<EventOverviewPage />} />
            <Route path="/add-event" element={<CreateEventPage />} />
            <Route path="/menu-preparation" element={<EventPreparationPage />} />
            <Route
              path="/menu-allocation"
              element={<EventMenuAllocationPage />}
            />
            <Route
              path="/raw-material-allocation"
              element={<RawMaterialAllocationPage />}
            />
            <Route
              path="/labour-and-other-management"
              element={<LabourOtherManagementPage />}
            />
            <Route
              path="/order-booking-reports"
              element={<OrderBookingReportsPage />}
            />
            <Route path="/dish-costing" element={<DishCostingPage />} />
          
            <Route path="/event-invoice" element={<EventInvoicePage />} />
            <Route path="/add-invoice" element={<AddInvoicePage />} />
            <Route path="/view-invoice" element={<InvoiceViewPage />} />
            <Route path="/proforma-invoice" element={<ProformaInvoicePage />} />

            {/* Tasks routes */}
            <Route path="/tasks" element={<TaskListPage />}></Route>
            <Route
              path="/tasks-directory"
              element={<TaskDirectoryPage />}
            ></Route>
            <Route path="/tasks-template" element={<TaskTemplatePage />}></Route>

            {/* leavs route */}
            <Route path="/approval" element={<Approval />}></Route>
            <Route path="/holiday" element={<Holiday />}></Route>
            <Route path="/myleaves" element={<MyLeaves />}></Route>
            <Route path="/allleave" element={<Allleave />}></Route>
            <Route path="allattendance" element={<AllAttendance />}></Route>
            <Route path="leavetype" element={<LeaveType />}></Route>
            <Route path="/myattendance" element={<Myattendance />}></Route>
            <Route path="/leave-dashboard" element={<Leavedashboard />}></Route>
            <Route
              path="/attendance-setting"
              element={<AttendanceSetting></AttendanceSetting>}
            ></Route>
            <Route path="officesetting" element={<OfficeSetting />}></Route>
            {/* Settings routes */}
            <Route path="/settings/general" element={<GeneralSettingsPage />} />
            <Route
              path="/settings/customize"
              element={<CustomizeSettingsPage />}
            />
            <Route path="/settings/channel" element={<ChannelSettingsPage />} />
            <Route
              path="/settings/notifications"
              element={<NotificationsSettingsPage />}
            />
            {/* Support routes */}
            <Route path="/support/events" element={<EventsPage />} />
            <Route path="/support/tutorials" element={<TutorialsPage />} />
            <Route path="/support/tickets" element={<TicketsPage />} />
            <Route path="/support/application" element={<ApplicationPage />} />
            <Route
              path="/support/progress-checklist"
              element={<ProgressChecklistPage />}
            />
            <Route path="/support/raise-ticket" element={<RaiseTicketPage />} />
            {/* Billing routes */}
            <Route path="/billing/overview" element={<BillingOverviewPage />} />
            <Route path="/billing/wallet-logs" element={<WalletLogsPage />} />
            {/* Theme route */}
            <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
            <Route
              path="/public-profile/profiles/default"
              element={<ProfileDefaultPage />}
            />
            <Route
              path="/public-profile/profiles/creator"
              element={<ProfileCreatorPage />}
            />
            <Route
              path="/public-profile/profiles/company"
              element={<ProfileCompanyPage />}
            />
            <Route
              path="/public-profile/profiles/nft"
              element={<ProfileNFTPage />}
            />
            <Route
              path="/public-profile/profiles/blogger"
              element={<ProfileBloggerPage />}
            />
            <Route
              path="/public-profile/profiles/crm"
              element={<ProfileCRMPage />}
            />
            <Route
              path="/public-profile/profiles/gamer"
              element={<ProfileGamerPage />}
            />
            <Route
              path="/public-profile/profiles/feeds"
              element={<ProfileFeedsPage />}
            />
            <Route
              path="/public-profile/profiles/plain"
              element={<ProfilePlainPage />}
            />
            <Route
              path="/public-profile/profiles/modal"
              element={<ProfileModalPage />}
            />
            <Route
              path="/public-profile/projects/3-columns"
              element={<ProjectColumn3Page />}
            />
            <Route
              path="/public-profile/projects/2-columns"
              element={<ProjectColumn2Page />}
            />
            <Route path="/public-profile/works" element={<ProfileWorksPage />} />
            <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
            <Route
              path="/public-profile/network"
              element={<ProfileNetworkPage />}
            />
            <Route
              path="/public-profile/activity"
              element={<ProfileActivityPage />}
            />
            <Route
              path="/public-profile/campaigns/card"
              element={<CampaignsCardPage />}
            />
            <Route
              path="/public-profile/campaigns/list"
              element={<CampaignsListPage />}
            />
            <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
            <Route
              path="/account/home/get-started"
              element={<AccountGetStartedPage />}
            />
            <Route
              path="/account/home/user-profile"
              element={<AccountUserProfilePage />}
            />
            <Route
              path="/account/home/company-profile"
              element={<AccountCompanyProfilePage />}
            />
            <Route
              path="/account/home/settings-sidebar"
              element={<AccountSettingsSidebarPage />}
            />
            <Route
              path="/account/home/settings-enterprise"
              element={<AccountSettingsEnterprisePage />}
            />
            <Route
              path="/account/home/settings-plain"
              element={<AccountSettingsPlainPage />}
            />
            <Route
              path="/account/home/settings-modal"
              element={<AccountSettingsModalPage />}
            />
            <Route path="/account/billing/basic" element={<AccountBasicPage />} />
            <Route
              path="/account/billing/enterprise"
              element={<AccountEnterprisePage />}
            />
            <Route path="/account/billing/plans" element={<AccountPlansPage />} />
            <Route
              path="/account/billing/history"
              element={<AccountHistoryPage />}
            />
            <Route
              path="/account/security/get-started"
              element={<AccountSecurityGetStartedPage />}
            />
            <Route
              path="/account/security/overview"
              element={<AccountOverviewPage />}
            />
            <Route
              path="/account/security/allowed-ip-addresses"
              element={<AccountAllowedIPAddressesPage />}
            />
            <Route
              path="/account/security/privacy-settings"
              element={<AccountPrivacySettingsPage />}
            />
            <Route
              path="/account/security/device-management"
              element={<AccountDeviceManagementPage />}
            />
            <Route
              path="/account/security/backup-and-recovery"
              element={<AccountBackupAndRecoveryPage />}
            />
            <Route
              path="/account/security/current-sessions"
              element={<AccountCurrentSessionsPage />}
            />
            <Route
              path="/account/security/security-log"
              element={<AccountSecurityLogPage />}
            />
            <Route
              path="/account/members/team-starter"
              element={<AccountTeamsStarterPage />}
            />
            <Route path="/account/members/teams" element={<AccountTeamsPage />} />
            <Route
              path="/account/members/team-info"
              element={<AccountTeamInfoPage />}
            />
            <Route
              path="/account/members/members-starter"
              element={<AccountMembersStarterPage />}
            />
            <Route
              path="/account/members/team-members"
              element={<AccountTeamMembersPage />}
            />
            <Route
              path="/account/members/import-members"
              element={<AccountImportMembersPage />}
            />
            <Route path="/account/members/roles" element={<AccountRolesPage />} />
            <Route
              path="/account/members/permissions-toggle"
              element={<AccountPermissionsTogglePage />}
            />
            <Route
              path="/account/members/permissions-check"
              element={<AccountPermissionsCheckPage />}
            />
            <Route
              path="/account/integrations"
              element={<AccountIntegrationsPage />}
            />
            <Route
              path="/account/notifications"
              element={<AccountNotificationsPage />}
            />
            <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
            <Route
              path="/account/appearance"
              element={<AccountAppearancePage />}
            />
            <Route
              path="/account/invite-a-friend"
              element={<AccountInviteAFriendPage />}
            />
            <Route path="/account/activity" element={<AccountActivityPage />} />
            <Route
              path="/network/get-started"
              element={<NetworkGetStartedPage />}
            />
            <Route
              path="/network/user-cards/mini-cards"
              element={<NetworkMiniCardsPage />}
            />
            <Route
              path="/network/user-cards/team-crew"
              element={<NetworkUserCardsTeamCrewPage />}
            />
            <Route
              path="/network/user-cards/author"
              element={<NetworkAuthorPage />}
            />
            <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
            <Route
              path="/network/user-cards/social"
              element={<NetworkSocialPage />}
            />
            <Route
              path="/network/user-table/team-crew"
              element={<NetworkUserTableTeamCrewPage />}
            />
            <Route
              path="/network/user-table/app-roster"
              element={<NetworkAppRosterPage />}
            />
            <Route
              path="/network/user-table/market-authors"
              element={<NetworkMarketAuthorsPage />}
            />
            <Route
              path="/network/user-table/saas-users"
              element={<NetworkSaasUsersPage />}
            />
            <Route
              path="/network/user-table/store-clients"
              element={<NetworkStoreClientsPage />}
            />
            <Route
              path="/network/user-table/visitors"
              element={<NetworkVisitorsPage />}
            />
            <Route
              path="/auth/welcome-message"
              element={<AuthenticationWelcomeMessagePage />}
            />
            <Route
              path="/auth/account-deactivated"
              element={<AuthenticationAccountDeactivatedPage />}
            />
            <Route
              path="/authentication/get-started"
              element={<AuthenticationGetStartedPage />}
            />
          </Route>
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};
export { AppRoutingSetup };
