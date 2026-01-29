import { SkillsTable } from "@/components/admin/skill-table";
import { StatsTable } from "@/components/admin/stat-table";

const AdminSkillsPage = () => {
  return (
    <div className="p-8 space-y-12">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the technologies displayed in your skills carousel
          </p>
        </div>
        <SkillsTable />
      </div>

      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Statistics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the statistics displayed below the skills carousel
          </p>
        </div>
        <StatsTable />
      </div>
    </div>
  );
};

export default AdminSkillsPage;
