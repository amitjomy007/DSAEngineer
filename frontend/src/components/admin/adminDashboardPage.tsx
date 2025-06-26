import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SearchAndFilters from "./SearchAndFilters";
import ProblemList from "./ProblemList";

import AllSubmissionsView from "./AllSubmissionsView";
import ReportsViewer from "./ReportsViewer";
import SuperAdminPanel from "./SuperAdminPanel";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("problems");
  const [submissionFilters, setSubmissionFilters] = useState<{
    problemId?: number;
    problemTitle?: string;
  } | null>(null);

  const handleViewSubmissions = (problemId: number, problemTitle: string) => {
    setSubmissionFilters({ problemId, problemTitle });
    setActiveItem("submissions");
  };

//   const handleBackFromSubmissions = () => {
//     setSubmissionFilters(null);
//     setActiveItem("problems");
//   };
//unused hence commented

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Dashboard Overview
            </h2>
            <p className="text-slate-400">Dashboard content coming soon...</p>
          </div>
        );
      case "problems":
        return (
          <div>
            <SearchAndFilters />
            <ProblemList onViewSubmissions={handleViewSubmissions} />
          </div>
        );
      case "submissions":
        return <AllSubmissionsView initialFilters={submissionFilters} />;
      case "reports":
        return <ReportsViewer />;
      case "super-admin":
        return <SuperAdminPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
