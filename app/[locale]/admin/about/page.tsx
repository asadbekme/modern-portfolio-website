"use client";

import { useQuery } from "@tanstack/react-query";
import { aboutService } from "@/services/about-service";
import { AboutForm } from "@/components/admin/about-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminAboutPage() {
  const {
    data: about,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["about"],
    queryFn: aboutService.getAbout,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load about data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No About Data</AlertTitle>
          <AlertDescription>
            No about section data found. Please create an about record in the
            database first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">About Section</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your portfolio&apos;s about section content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Content</CardTitle>
          <CardDescription>
            Update the content displayed in the about section of your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AboutForm about={about} />
        </CardContent>
      </Card>
    </div>
  );
}
