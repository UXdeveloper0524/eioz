import type { Metadata } from "next";
import PageContent from "@/components/pages/careers";
import { pageMetadata } from "@/lib/site";
import { getJobs, getSitePage } from "@/lib/strapi";

const description = 'Join EIOZ Energy: current openings for Regional Manager, Project Manager, Site Supervisor and Sales Manager in the lighting and energy industry.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage("careers");
  return pageMetadata(page?.seoTitle ?? "Careers", page?.seoDescription ?? description, "/careers");
}

export default async function Page() {
  const [jobs, hero] = await Promise.all([getJobs(), getSitePage("careers")]);
  return <PageContent jobs={jobs} hero={hero} />;
}
