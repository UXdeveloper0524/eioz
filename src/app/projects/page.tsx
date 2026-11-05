import type { Metadata } from "next";
import PageContent from "@/components/pages/projects";
import { pageMetadata } from "@/lib/site";
import { getProjects, getSitePage } from "@/lib/strapi";

const description = 'EIOZ Energy lighting projects from 2015 to 2024 across residential, commercial, hospitality, infrastructure, industrial and public sectors.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage("projects");
  return pageMetadata(page?.seoTitle ?? "Projects", page?.seoDescription ?? description, "/projects");
}

export default async function Page() {
  const [projects, hero] = await Promise.all([getProjects(), getSitePage("projects")]);
  return <PageContent projects={projects} hero={hero} />;
}
