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
import QuotationPage from "@/pages/Event/QuotationPage";
import EventInvoicePage from "@/pages/Event/EventInvoicePage";
import ProformaInvoicePage from "@/pages/Event/ProformaInvoicePage";

const AppRoutingSetup = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          {/* project routs */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts/details" element={<ContactDetail />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/lead" element={<LeadPage />} />
          <Route path="/lead/details" element={<LeadDetailPage />} />
          <Route path="/overview" element={<OverviewPage />} />

          <Route path="/company" element={<CompanyListPage />}></Route>
          <Route path="/companydetails" element={<CompanyDetails />}></Route>
          <Route path="/followup" element={<FollowUpListPage />}></Route>
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
          <Route path="/add-event" element={<CreateEventPage />} />
          <Route path="/menu-preparation" element={<EventPreparationPage />} />
          <Route path="/menu-allocation" element={<EventMenuAllocationPage />} />
          <Route path="/raw-material-allocation" element={<RawMaterialAllocationPage />} />
          <Route path="/labour-and-other-management" element={<LabourOtherManagementPage />} />
          <Route path="/order-booking-reports" element={<OrderBookingReportsPage />} />
          <Route path="/dish-costing" element={<DishCostingPage />} />
          <Route path="/quotation" element={<QuotationPage />} />
          <Route path="/event-invoice" element={<EventInvoicePage />} />
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
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};
export { AppRoutingSetup };
