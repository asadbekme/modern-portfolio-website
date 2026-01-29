import { ProjectsTable } from "@/components/admin/project-table";

const AdminProjectsPage = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your portfolio projects
        </p>
      </div>
      <ProjectsTable />
    </div>
  );
};

export default AdminProjectsPage;
