import { DashboardHeaderSection } from "./sections/dashboard-header-section";
import { StatsSection } from "./sections/stats-section";
import { RecentStandardsSection } from "./sections/recent-standards-section";
import { QuickActionsSection } from "./sections/quick-actions-section";

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <DashboardHeaderSection />
      <StatsSection />
      <RecentStandardsSection />
      <QuickActionsSection />
    </div>
  );
};
