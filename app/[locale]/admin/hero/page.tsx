"use client";

import { useQuery } from "@tanstack/react-query";
import { heroService } from "@/services/hero-service";
import { HeroForm } from "@/components/admin/hero-form";
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

export default function AdminHeroPage() {
  const {
    data: hero,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hero"],
    queryFn: heroService.getHero,
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
            {Array.from({ length: 6 }).map((_, i) => (
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
            Failed to load hero data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Hero Data</AlertTitle>
          <AlertDescription>
            No hero section data found. Please create a hero record in the
            database first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hero Section</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your portfolio&apos;s hero section content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Content</CardTitle>
          <CardDescription>
            Update the content displayed in the hero section of your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeroForm hero={hero} />
        </CardContent>
      </Card>
    </div>
  );
}
