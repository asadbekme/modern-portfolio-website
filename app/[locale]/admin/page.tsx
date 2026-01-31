"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { skillService } from "@/services/skill-service";
import { statService } from "@/services/stat-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  Eye,
  EyeOff,
  Code2,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: skillService.getAllSkills,
  });

  const { data: stats = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: statService.getAllStats,
  });

  const publishedCount = projects.filter((p) => p.is_published).length;
  const draftCount = projects.filter((p) => !p.is_published).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your portfolio admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              All projects in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Visible on website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Hidden projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="text-xs text-muted-foreground">
              Technologies in carousel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stats</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
            <p className="text-xs text-muted-foreground">
              Statistics displayed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Link
              href="/admin/projects"
              className="block p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="font-medium">Manage Projects</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or delete portfolio projects
              </div>
            </Link>
            <Link
              href="/admin/skills"
              className="block p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="font-medium">Manage Skills</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or delete skills in the carousel
              </div>
            </Link>
            <Link
              href="/admin/hero"
              className="block p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="font-medium">Hero Section</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Edit the hero section content and settings
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
